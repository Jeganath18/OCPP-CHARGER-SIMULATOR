import {
  Component,
  Renderer2,
  ElementRef,
  signal,
  ViewChild,
} from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { WebSocketService } from '../services/websocket.service';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

type Payload =
  | { idTag: string }
  | { chargepointmodel: string; chargepointvendor: string }
  | { reservationid: number }
  | { connectorid: number; type: string }
  | { key: string; value: string }
  | {}
  | { vendorid: string }
  | { status: string };

type UploadStatus = 'Idle' | 'Uploaded' | 'UploadFailed' | 'Uploading';
type Rfid = 'No. of RFID' | '1' | '2' | '3' | '4' | '5';
type firmStatus =
  | 'Downloaded'
  | 'DownloadFailed'
  | 'Downloading'
  | 'Idle'
  | 'InstallationFailed'
  | 'Installing'
  | 'Installed';

@Component({
  selector: 'app-home',
  imports: [
    NgFor,
    NgIf,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatProgressBarModule,
    ScrollingModule,
    MatSelectModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;
  options: string[] = ['1', '2', '3', '4', '5'];
  selectedOption: string = '';
  connectionStatus: string = '';
  rfidInputs: string[] = [];
  statuses: UploadStatus[] = ['Idle', 'Uploaded', 'UploadFailed', 'Uploading'];
  datatransferid: String[] = [
    'Accepted',
    'Rejected',
    'UnknownMessageId',
    'UnknownVendorId',
  ];
  reservationstatus: String[] = [
    'Accepted',
    'Faulted',
    'Occupied',
    'Rejected',
    'Unavailable',
  ];
  sendlist_status: String[] = [
    'Accepted',
    'Failed',
    'NotSupported',
    'VersionMismatch',
  ];
  chargingprofile_status: String[] = ['Accepted', 'Rejected', 'NotSupported'];
  trigger_status: String[] = ['Accepted', 'Rejected', 'NotImplemented'];
  unlock_status: String[] = ['Unlocked', 'UnlockFailed', 'NotSupported'];
  signalArray = signal('');
  logsList: string[] = [];
  ReqsList: string[] = [];
  serverMessage = '';
  request = signal('');
  isurl = signal(false);
  isconnected = false;

  private statusSubscription!: Subscription;
  private msgfromserver!: Subscription;
  connect = false;
  connectbtn = false;
  res = true;
  selectedButton: HTMLElement | null = null;
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private websocketService: WebSocketService
  ) {}

  selectedToggle = new FormControl('Client');
  Client: boolean = true;
  Server: boolean = false;

  ngOnInit(): void {
    // Subscribe to valueChanges to handle the toggled option
    this.selectedToggle.valueChanges.subscribe((value) => {
      if (value !== null) this.handleToggleChange(value);
    });
  }

  handleToggleChange(value: string): void {
    if (value === 'Client') {
      this.Client = true;
      this.Server = false;
      console.log('Client selected');
    } else if (value === 'Server') {
      this.Server = true;
      this.Client = false;
      console.log('Server selected');
      this.req_server();
    }
    console.log(`Currently selected button: ${value}`);
  }

  req_server(): void {
    this.msgfromserver = this.websocketService.messages$.subscribe(
      (message) => {
        if (message.charAt(1) === '2') {
          this.appendreq(message);
          console.log(message);
        }
      }
    );
  }
  currentlog = [];
  start_uuid = '';
  cancel_uuid = '';
  change_uuid = '';
  change_configuuid = '';
  clearcache__uuid = '';
  clearcharging_uuid = '';
  data_uuid = '';
  getcomposite_uuid = '';
  getconfig__uuid = '';
  getdiagnostics_uuid = '';
  getlist_uuid = '';
  stop_uuid = '';
  reserve_uuid = '';
  reset_uuid = '';
  sendlist_uuid = '';
  setcharging_uuid = '';
  trigger_uuid = '';
  unlock_uuid = '';
  update_uuid = '';
  req: boolean = false;
  ress: boolean = false;
  err: boolean = false;
  appendreq(newLog: string): void {
    this.currentlog = [];
    this.currentlog = JSON.parse(newLog);
    switch (this.currentlog[2]) {
      case 'CancelReservation':
        this.cancel_uuid = this.currentlog[1];
        break;
      case 'ChangeAvailability':
        this.change_uuid = this.currentlog[1];
        break;
      case 'ChangeConfiguration':
        this.change_configuuid = this.currentlog[1];
        break;
      case 'ClearCache':
        this.clearcache__uuid = this.currentlog[1];
        break;
      case 'ClearChargingProfile':
        this.clearcharging_uuid = this.currentlog[1];
        break;
      case 'DataTransfer':
        this.data_uuid = this.currentlog[1];
        break;
      case 'GetCompositeSchedule':
        this.getcomposite_uuid = this.currentlog[1];
        break;
      case 'GetConfiguration':
        this.getconfig__uuid = this.currentlog[1];
        break;
      case 'GetDiagnostics':
        this.getdiagnostics_uuid = this.currentlog[1];
        break;
      case 'GetLocalListVersion':
        this.getlist_uuid = this.currentlog[1];
        break;
      case 'RemoteStartTransaction':
        this.start_uuid = this.currentlog[1];
        break;
      case 'RemoteStopTransaction':
        this.stop_uuid = this.currentlog[1];
        break;
      case 'ReserveNow':
        this.reserve_uuid = this.currentlog[1];
        break;
      case 'Reset':
        this.reserve_uuid = this.currentlog[1];
        break;
      case 'SendLocalList':
        this.sendlist_uuid = this.currentlog[1];
        break;
      case 'SetChargingProfile':
        this.setcharging_uuid = this.currentlog[1];
        break;
      case 'TriggerMessage':
        this.trigger_uuid = this.currentlog[1];
        break;
      case 'UnlockConnector':
        this.unlock_uuid = this.currentlog[1];
        break;
      case 'UpdateFirmware':
        this.update_uuid = this.currentlog[1];
        break;
    }

    if (!this.ReqsList.includes(newLog)) {
      if (JSON.parse(newLog)[0] === 2) {
        this.req = true;
        this.ress = false;
        this.err = false;
        this.ReqsList.unshift('REQ: ' + newLog);
      } else if (JSON.parse(newLog)[0] === 3) {
        this.ress = true;
        this.req = false;
        this.err = false;
        this.ReqsList.unshift('RES: ' + newLog);
      } else {
        this.err = true;
        this.req = false;
        this.ress = false;
        this.ReqsList.unshift('ERR: ' + newLog);
      }
      console.log(this.currentlog);
    }
  }

  //Connection to the server
  configuration = signal<string>('');
  connectBtn(url: string): void {
    let connectUrl = url;
    try {
      if (this.isValidWebSocketURL(connectUrl.trim())) {
        this.websocketService.connect(connectUrl.trim());
        // let btn = this.el.nativeElement.querySelector('#connect');
        // btn.innerHTML = 'Connecting...';
        // this.connect = true;
        console.log(connectUrl);
      } else {
        console.error('WebSocket connection failed');
        this.res = false;
        let url = this.el.nativeElement.querySelector('.url');
        url.value = '';
        let btn = this.el.nativeElement.querySelector('#connect');
        btn.innerHTML = 'Connect';
        this.updateUI(false);
        this.dialog();
      }
    } catch (e) {
      console.error('WebSocket connection failed:', e);
      let url = this.el.nativeElement.querySelector('.url');
      url.value = '';
      this.updateUI(false);
      let btn = this.el.nativeElement.querySelector('#connect');
      btn.innerHTML = 'Connect';
      this.dialog();
      this.isconnected = false;
    }

    this.statusSubscription = this.websocketService.connectionStatus$.subscribe(
      (statusMessage: string) => {
        this.connectionStatus = statusMessage;
        if (this.connectionStatus === 'WebSocket error occurred') {
          this.updateUI(false);
          this.connect = false;
          this.res = true;
          this.dialog();
          this.isconnected = false;
          const paragraph =
            this.el.nativeElement.querySelector('#dynamic-paragraph');
          this.renderer.setProperty(paragraph, 'textContent', '');
          const successMessage = this.renderer.createText('');
          this.renderer.appendChild(paragraph, successMessage);
        } else if (this.connectionStatus === 'WebSocket connection closed') {
          this.connectbtn = false;
          this.isconnected = false;
          const paragraph =
            this.el.nativeElement.querySelector('#dynamic-paragraph');
          this.renderer.setProperty(paragraph, 'textContent', '');
          const successMessage = this.renderer.createText('');
          this.renderer.appendChild(paragraph, successMessage);
        } else {
          this.updateUI(true);
          this.isconnected = true;
          this.connect = false;
          this.connectbtn = true;
          this.connectionStatus = '';
        }
      },
      (error) => {
        console.error('Error in WebSocket connection', error);
        this.updateUI(false);
      }
    );
  }

  clear():void{
    let inp = this.el.nativeElement.querySelector('#inp');
    inp.value = '';
  }

  disconnect(): void {
    this.res = true;
    this.connectbtn = false;
    this.isconnected = false;
    let url1 = this.el.nativeElement.querySelector('.url');
    url1.value = '';
    this.websocketService.disconnect();
    const paragraph = this.el.nativeElement.querySelector('#dynamic-paragraph');
    this.renderer.setProperty(paragraph, 'textContent', '');
    this.renderer.removeStyle(paragraph,'width');
    this.renderer.removeStyle(paragraph,'background-color')
    const successMessage = this.renderer.createText('');
    this.renderer.appendChild(paragraph, successMessage);
  }

  isValidWebSocketURL(text: string): boolean {
    const urlPattern: RegExp = new RegExp(
      '^((ws|wss|http|https):\\/\\/)' + // Protocol (ws, wss, http, or https)
        '(([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}|' + // Domain name
        '(\\d{1,3}\\.){3}\\d{1,3}|localhost)' + // OR IPv4 address or localhost
        '(\\:\\d+)?' + // Port (optional)
        '(\\/[-a-zA-Z0-9@:%_+.~#?&=]*)*' + // Path (optional)
        '(\\?[;&a-zA-Z0-9@:%_+.~#?&=]*)?' + // Query string (optional)
        '(\\#[-a-zA-Z0-9@:%_+.~#?&=]*)?$', // Fragment (optional)
      'i'
    );
    return urlPattern.test(text);
  }

  async updateUI(isConnected: boolean): Promise<void> {
    const paragraph = this.el.nativeElement.querySelector('#dynamic-paragraph');
    // this.renderer.setProperty(paragraph, 'textContent', 'Connecting...');Z
    if (isConnected) {
      this.renderer.setProperty(paragraph, 'textContent', '');
      const successMessage = this.renderer.createText(
        'Successfully connected to the server!'
      );
      this.renderer.setStyle(paragraph, 'color', '#00b4b4');
      this.renderer.setStyle(paragraph, 'background-color', '#d9fbfb');
      this.renderer.setStyle(paragraph, 'border-radius', '16px');
      this.renderer.setStyle(paragraph, 'text-align', 'centre');
      this.renderer.setStyle(paragraph,'width','320px');
      this.renderer.setStyle(paragraph,'padding','5px 20px');

// width: 320px; padding: 5px 20px;

      this.renderer.appendChild(paragraph, successMessage);
    } else {
      if (this.res) {
        this.renderer.setProperty(paragraph, 'textContent', '');
        const errorMessage = this.renderer.createText(
          'Try again with a different URL'
        );
        this.renderer.setStyle(paragraph, 'color', '#009c9c');
        this.renderer.appendChild(paragraph, errorMessage);
        let btn = this.el.nativeElement.querySelector('#connect');
        btn.innerHTML = 'Connect';
      } else {
        // this.renderer.setProperty(paragraph, 'textContent', '');
        // const errorMessage = this.renderer.createText(
        //   'Connection failed. Check the URL and try again.'
        // );
        // this.renderer.setStyle(paragraph, 'color', 'red');
        // this.renderer.appendChild(paragraph, errorMessage);
      }
    }
  }
  connectionUrl: string = '';
  onSubmit() {
    console.log(this.connectionUrl);
  }

  dialog(): void {
    this.isurl = signal(true);
  }

  close() {
    this.isurl = signal(false);
  }

  rfid: Rfid[] = ['No. of RFID', '1', '2', '3', '4', '5'];
  isAuthActive: boolean = false;
  isAuth: boolean = false;
  // Authorize Request
  auth(): void {
    if (this.isconnected === false) {
      this.dialog();
      return;
    }

    let inp = this.el.nativeElement.querySelector('#inp');
    if (!inp.value) {
      let btn = this.el.nativeElement.querySelector('#send');
    }
    if (this.isAuthActive) {
      this.clearAllElements();
      this.isAuthActive = false;
      this.isAuth = false;
      inp.value = '';
      this.configuration = signal('Configuration');
    } else {
      if (
        !this.isFormVisible &&
        !this.isdiagVisible &&
        !this.isfirmware &&
        !this.ismetervalue &&
        !this.istart &&
        !this.istatus &&
        !this.istop && !this.isdata
      ) {
        this.configuration = signal('Authorize');
        this.isAuth = true;
        let container = this.el.nativeElement.querySelector('.container');
        if (this.rfidInputs.length != 0) {
          let authContainer = this.el.nativeElement.querySelector('.auth');
          container = this.renderer.createElement('div');
          this.renderer.addClass(container, 'container');
          this.renderer.appendChild(authContainer, container);
          this.rfidInputs.forEach((rfid, index) => {
            const button = this.renderer.createElement('button');
            const buttonText = this.renderer.createText(`RFID ${index + 1}`);
            this.renderer.appendChild(button, buttonText);

            // Add event listener to display RFID value
            button.addEventListener('click', () => {
              this.displayRFID(rfid);
            });

            this.renderer.appendChild(container, button);
          });
        }
        this.createDynamicElements(); // Initialize the dropdown
        this.isAuthActive = true;
        inp.value = '';
      } else {
        this.isFormVisible = false;
        this.isdiagVisible = false;
        this.isfirmware = false;
        this.ismetervalue = false;
        this.istart = false;
        this.istatus = false;
        this.istop = false;
        this.isdata=false;
        this.auth();
      }
    }
  }

  createDynamicElements(): void {
    let authContainer = this.el.nativeElement.querySelector('.auth');
    if (!authContainer) {
      authContainer = this.renderer.createElement('div');
      this.renderer.addClass(authContainer, 'auth');
      this.renderer.appendChild(this.el.nativeElement, authContainer);
    }

    // Create a dropdown container
    let dropdownContainer = this.el.nativeElement.querySelector(
      '#dropdown-container'
    );
    if (!dropdownContainer) {
      dropdownContainer = this.renderer.createElement('div');
      this.renderer.setAttribute(dropdownContainer, 'id', 'dropdown-container');
      this.renderer.appendChild(authContainer, dropdownContainer);
    }

    // Create dropdown label and select
    const select = this.renderer.createElement('select');
    this.renderer.setAttribute(select, 'id', 'dropdown');
    this.renderer.setStyle(select, 'padding', '5px');
    this.renderer.setStyle(select, 'font-size', '14px');
    this.renderer.listen(select, 'change', (event) =>
      this.onOptionChange(event)
    );

    // Add default and dynamic options
    const defaultOption = this.renderer.createElement('option');
    this.renderer.setAttribute(defaultOption, 'value', '');
    this.renderer.setAttribute(defaultOption, 'disabled', 'true');
    this.renderer.setAttribute(defaultOption, 'selected', 'true');
    this.renderer.appendChild(
      defaultOption,
      this.renderer.createText('No. of RFID')
    );
    this.renderer.appendChild(select, defaultOption);

    this.options.forEach((option) => {
      const optionElement = this.renderer.createElement('option');
      this.renderer.setAttribute(optionElement, 'value', option);
      this.renderer.appendChild(
        optionElement,
        this.renderer.createText(option)
      );
      this.renderer.appendChild(select, optionElement);
    });

    // Append label and select to dropdown container
    this.renderer.appendChild(dropdownContainer, select);
  }

  onOptionChange(event: any): void {
    this.selectedOption = event.target.value;
    const num = Number(this.selectedOption);
    this.createInput(num);
  }

  createInput(num: number): void {
    // Locate the container or create it if it doesn't exist
    let container = this.el.nativeElement.querySelector('.container');
    if (!container) {
      container = this.renderer.createElement('div');
      this.renderer.addClass(container, 'container');
      const parent = this.el.nativeElement.querySelector('.auth');
      this.renderer.appendChild(parent, container);
    }

    // Clear the container
    while (container.firstChild) {
      this.renderer.removeChild(container, container.firstChild);
    }

    // Dynamically create input fields for RFID and a single submit button
    for (let i = 1; i <= num; i++) {
      const div = this.renderer.createElement('div');
      this.renderer.addClass(div, 'boxes');

      const textbox = this.renderer.createElement('input');
      this.renderer.setAttribute(textbox, 'type', 'text');
      this.renderer.setAttribute(textbox, 'placeholder', `Enter RFID ${i}`);
      this.renderer.addClass(textbox, 'dynamic-input');
      this.renderer.setAttribute(textbox, 'id', `rfid-${i}`); // Unique ID

      this.renderer.appendChild(div, textbox);
      this.renderer.appendChild(container, div);
    }

    // Create a single submit button
    const submitButton = this.renderer.createElement('button');
    const buttonText = this.renderer.createText('Submit All RFIDs');
    this.renderer.appendChild(submitButton, buttonText);
    this.renderer.appendChild(container, submitButton);

    // Add event listener for the submit button
    submitButton.addEventListener('click', () => {
      // this.rfidInputs.length = 0; // Reset the inputs array

      // Collect RFID values
      for (let i = 1; i <= num; i++) {
        const textbox = this.el.nativeElement.querySelector(
          `#rfid-${i}`
        ) as HTMLInputElement;
        if (textbox) {
          this.rfidInputs.push(textbox.value);
        }
      }

      // Clear the container and create buttons based on RFID values
      while (container.firstChild) {
        this.renderer.removeChild(container, container.firstChild);
      }

      this.rfidInputs.forEach((rfid, index) => {
        const button = this.renderer.createElement('button');
        const buttonText = this.renderer.createText(`RFID ${index + 1}`);
        this.renderer.appendChild(button, buttonText);

        // Add event listener to display RFID value
        button.addEventListener('click', () => {
          this.displayRFID(rfid);
        });

        this.renderer.appendChild(container, button);
      });
    });
  }

  displayRFID(rfid: string): void {
    const authorizeReq = generateMessage('Authorize', { idTag: rfid });
    this.signalArray = signal(authorizeReq);
    this.request = signal(authorizeReq);
    console.log(authorizeReq);
  }



  private msgSubscription: Subscription | null = null;







  logit(req: any): void {
    const parsedReq = JSON.parse(req);
    this.websocketService.sendMessage(JSON.stringify(parsedReq));
    this.appendLog(req);
    console.log('sent messsage:', JSON.stringify(parsedReq));
    if (this.msgfromserver) {
      this.msgfromserver.unsubscribe();
    }
      this.msgfromserver = this.websocketService.messages$.subscribe(
        (message) => {
          this.appendLog(message);
          console.log(message);
        }
      );
  }
  currentreq = [];
  appendLog(newLog: string): void {
    const parsedLog = JSON.parse(newLog);
    if (!this.logsList.includes(newLog)) {
      this.currentreq = JSON.parse(newLog);
      if (parsedLog[0] === 2) {
        this.logsList.unshift('REQ: ' + newLog);
      } else if (parsedLog[0] === 3) {
        this.logsList.unshift('RES: ' + newLog);
      } else {
        this.logsList.unshift('ERR: ' + newLog);
      }
      console.log(newLog.charAt(1));
    }
    console.log(this.logsList.length);
    if (this.msgfromserver) {
      this.msgfromserver.unsubscribe();
    }
  }

  clearAllElements(): void {
    const authContainer = this.el.nativeElement.querySelector('.auth');
    if (authContainer) {
      while (authContainer.firstChild) {
        this.renderer.removeChild(authContainer, authContainer.firstChild);
      }
    }
    const container = this.el.nativeElement.querySelector('.container');
    if (container) {
      while (container.firstChild) {
        this.renderer.removeChild(container, container.firstChild);
      }
    }
  }

  //
  textboxes: string[] = ['']; // Initialize with one empty textbox
  dropdownValues: string[] = ['1', '2', '3', '4', '5'];
  Avaialability: string[] = ['Accepted', 'Rejected', 'Scheduled'];
  configurations: string[] = [
    'Accepted',
    'Rejected',
    'RebootRequired',
    'NotSupported',
  ];
  cache: string[] = ['Accepted', 'Unknown'];

  onInputChange(index: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.textboxes[index] = inputElement.value;
  }

  isdata: boolean = false;
  datatrans(): void {
    this.clearAllElements();
    this.isAuthActive = false;
    if (this.isconnected === false) {
      this.dialog();
      return;
    }
    if (this.isdata) {
      this.isdata = false;
      console.log('Data Transfer      :', this.isdata);
      this.configuration = signal('Configuration');
      let inp = this.el.nativeElement.querySelector('#inp');
      inp.value = '';
    } else {
      this.isdata = true;
      console.log('Data Transfer      :', this.isdata);
      this.configuration = signal('Data Transfer');
      this.setVisibility('data');
    }
  }
  data_func(vendor_id: String, message_id: String, data: String): void {
    const req = generateMessage('DataTransfer', {
      vendorId: vendor_id,
      messageId: message_id,
      data: data,
    });
    this.signalArray = signal(req);
    this.request = signal(req);
    console.log(req);
  }
  i = 0;
  bootNotification(): void {
    this.clearAllElements();
    this.isAuthActive = false;
    if (this.isconnected === false) {
      this.dialog();
      return;
    }
    const chargepointmodel = 'ModelX';
    const chargepointvendor = 'VendorY';
    const bootNotificationReq = generateMessage('BootNotification', {
      chargepointmodel: chargepointmodel,
      chargepointvendor: chargepointvendor,
    });
    let request: string[] = [chargepointmodel, chargepointvendor];
    this.i = this.i + 1;
    // this.createlements(request,this.i);
    this.toggleForm(2);
    console.log(bootNotificationReq, this.i);
  }

  isFormVisible: boolean = false; // Tracks form visibility
  textboxes1: number[] = []; // Array to manage textboxes

  // Toggles form visibility and creates/removes textboxes
  toggleForm(num: number): void {
    if (this.isFormVisible) {
      this.isFormVisible = false; // Remove all elements
      this.textboxes1 = [];
      this.configuration = signal('Configuration');
      let inp = this.el.nativeElement.querySelector('#inp');
      inp.value = '';
    } else {
      this.isFormVisible = true;
      this.setVisibility('form'); // Show elements
      this.configuration = signal('BootNotification');
      let count = num;
      this.textboxes1 = Array(count).fill(0);
    }
  }
  boot(model: string, vendor: string): void {
    console.log(model, vendor);
    const req = generateMessage('BootNotification', {
      chargepointmodel: model,
      chargepointvendor: vendor,
    });
    this.signalArray = signal(req);
    this.request = signal(req);
  }

  isdiagVisible: boolean = false;
  status: UploadStatus[] = ['Idle', 'Uploaded', 'UploadFailed', 'Uploading'];
  diagnostics(): void {
    this.clearAllElements();
    this.isAuthActive = false;
    if (this.isconnected === false) {
      this.dialog();
      return;
    }
    if (this.isdiagVisible) {
      this.isdiagVisible = false;
      this.configuration = signal('Configuration');
      let inp = this.el.nativeElement.querySelector('#inp');
      inp.value = '';
    } else {
      this.isdiagVisible = true;
      this.configuration = signal('Diagnostics Status');
      this.setVisibility('diagnostics'); // Show elements
    }
  }

  handleClick(status: UploadStatus): void {
    const req = generateMessage('DiagnosticsStatusNotification', {
      status: status,
    });
    this.signalArray = signal(req);
    this.request = signal(req);
    console.log(req);
    console.log(`Selected Status: ${status}`);
  }
  isfirmware: boolean = false;

  firmware_status: firmStatus[] = [
    'Downloaded',
    'DownloadFailed',
    'Downloading',
    'Idle',
    'InstallationFailed',
    'Installing',
    'Installed',
  ];
  firmware(): void {
    this.clearAllElements();
    this.isAuthActive = false;
    if (this.isconnected === false) {
      this.dialog();
      return;
    }
    if (this.isfirmware) {
      this.isfirmware = false; // Remove all elements
      this.configuration = signal('Configuration');
      let inp = this.el.nativeElement.querySelector('#inp');
      inp.value = '';
    } else {
      this.isfirmware = true; // Show elements
      this.configuration = signal('Firmware Status');
      this.setVisibility('firmware');
    }
  }

  handlefirm(status: firmStatus): void {
    const req = generateMessage('FirmwareStatusNotification', {
      status: status,
    });
    this.signalArray = signal(req);
    this.request = signal(req);
    console.log(req);
  }
  isheart: boolean = false;
  Heartbeatreq(): void {
    this.clearAllElements();
    this.isAuthActive = false;
    this.isFormVisible = false;
    this.isdiagVisible = false;
    this.isfirmware = false;
    this.ismetervalue = false;
    this.istart = false;
    this.istatus = false;
    this.istop = false;
    if (this.isconnected === false) {
      this.dialog();
      return;
    }
    if (this.isheart) {
      this.isheart = false; // Remove all elementsf
      this.configuration = signal('Configuration');
      let inp = this.el.nativeElement.querySelector('#inp');
      inp.value = '';
    } else {
      this.isheart = true; // Show elements
      this.configuration = signal('Heartbeat (No Configs)');
      const req = generateMessage('Heartbeat', {});
      this.request = signal(req);
      this.signalArray = signal(req);
      console.log(req);
    }
  }
  ismetervalue: boolean = false;
  meter_values(): void {
    this.clearAllElements();
    this.isAuthActive = false;
    if (this.isconnected === false) {
      this.dialog();
      return;
    }
    if (this.ismetervalue) {
      this.ismetervalue = false; // Remove all elements
      let inp = this.el.nativeElement.querySelector('#inp');
      inp.value = '';
      this.configuration = signal('Configuration');
    } else {
      this.ismetervalue = true; // Show elements
      this.configuration = signal('MeterValues');
      this.setVisibility('meterValue');
    }
  }
  selectedValue = 0;
  meter(metervalue: string, transvalue: string): void {
    const dateString = this.getIndianStandardTime(); // Generate current UTC time in ISO format
    const soc = 5; // Simulate State of Charge value
    const powerConsumed = metervalue;

    const meterValuesPayload = [
      {
        timestamp: dateString,
        sampledValue: [
          {
            phase: 'L1-N',
            unit: 'A',
            measurand: 'Voltage',
            value: '100',
            location: 'Inlet',
          },
          {
            phase: 'L2-N',
            unit: 'A',
            measurand: 'Voltage',
            value: '256',
            location: 'Inlet',
          },
          {
            phase: 'L3-N',
            unit: 'A',
            measurand: 'Voltage',
            value: '367.9',
            location: 'Inlet',
          },
          {
            phase: 'L1-L2',
            unit: 'A',
            measurand: 'Voltage',
            value: '498.6',
            location: 'Inlet',
          },
          {
            phase: 'L2-L3',
            unit: 'A',
            measurand: 'Voltage',
            value: '555',
            location: 'Inlet',
          },
          {
            phase: 'L3-L1',
            unit: 'A',
            measurand: 'Voltage',
            value: '678',
            location: 'Inlet',
          },
          {
            phase: 'L1-N',
            unit: 'A',
            measurand: 'Voltage',
            value: '143',
            location: 'Outlet',
          },
          {
            phase: 'L2-N',
            unit: 'A',
            measurand: 'Voltage',
            value: '212',
            location: 'Outlet',
          },
          {
            phase: 'L3-N',
            unit: 'A',
            measurand: 'Voltage',
            value: '345',
            location: 'Outlet',
          },
          {
            phase: 'L1-L2',
            unit: 'A',
            measurand: 'Voltage',
            value: '444',
            location: 'Outlet',
          },
          {
            phase: 'L2-L3',
            unit: 'A',
            measurand: 'Voltage',
            value: '558',
            location: 'Outlet',
          },
          {
            phase: 'L3-L1',
            unit: 'A',
            measurand: 'Voltage',
            value: '653',
            location: 'Outlet',
          },
          {
            phase: 'L1',
            measurand: 'Current.Import',
            value: '971',
            location: 'Outlet',
            unit: 'A',
          },
          {
            phase: 'L2',
            measurand: 'Current.Import',
            value: '711',
            location: 'Outlet',
            unit: 'A',
          },
          {
            phase: 'L3',
            measurand: 'Current.Import',
            value: '423',
            location: 'Outlet',
            unit: 'A',
          },
          {
            phase: 'OVERALL',
            measurand: 'Current.Import',
            value: '64',
            location: 'Outlet',
            unit: 'A',
          },
          {
            phase: 'L1',
            measurand: 'Current.Import',
            value: '78',
            location: 'Inlet',
            unit: 'A',
          },
          {
            phase: 'L2',
            measurand: 'Current.Import',
            value: '90',
            location: 'Inlet',
            unit: 'A',
          },
          {
            phase: 'L3',
            measurand: 'Current.Import',
            value: '42',
            location: 'Inlet',
            unit: 'A',
          },
          {
            phase: 'L1',
            unit: 'Wh',
            measurand: 'Power.Factor',
            value: '687',
            location: 'Outlet',
          },
          {
            phase: 'L2',
            measurand: 'Power.Factor',
            value: '34',
            location: 'Outlet',
            unit: 'Wh',
          },
          {
            phase: 'L3',
            measurand: 'Power.Factor',
            value: '533',
            location: 'Outlet',
            unit: 'Wh',
          },
          {
            phase: 'OVERALL',
            measurand: 'Power.Factor',
            value: '786',
            location: 'Outlet',
            unit: 'Wh',
          },
          {
            phase: 'L1',
            measurand: 'Power.Factor',
            value: '666',
            location: 'Inlet',
            unit: 'Wh',
          },
          {
            phase: 'L2',
            measurand: 'Power.Factor',
            value: '785',
            location: 'Inlet',
            unit: 'Wh',
          },
          {
            phase: 'L3',
            measurand: 'Power.Factor',
            value: '809',
            location: 'Inlet',
            unit: 'Wh',
          },
          {
            phase: 'OVERALL',
            measurand: 'Power.Factor',
            value: '910',
            location: 'Inlet',
            unit: 'Wh',
          },
          {
            value: powerConsumed,
            context: 'Sample.Periodic',
            measurand: 'Energy.Active.Import.Register',
            unit: 'Wh',
          },
        ],
      },
    ];

    const req = generateMessage('MeterValues', {
      connectorId: this.selectedValue,
      transactionId: transvalue,
      meterValue: meterValuesPayload,
    });

    this.signalArray = signal(req);
    this.request = signal(req);
    console.log(req);
  }

  onValueChange(event: any) {
    this.selectedValue = Number(event.value); // Get the selected value
    console.log(this.selectedValue);
  }
  istart: boolean = false;
  start_transaction(): void {
    this.clearAllElements();
    this.isAuthActive = false;
    if (this.isconnected === false) {
      this.dialog();
      return;
    }
    if (this.istart) {
      this.istart = false; // Remove all elements
      let inp = this.el.nativeElement.querySelector('#inp');
      inp.value = '';
      this.configuration = signal('Configuration');
    } else {
      this.istart = true; // Show elements
      this.configuration = signal('StartTransaction');
      this.setVisibility('start');
    }
  }

  selected = 0;
  Change(event: any): void {
    this.selected = Number(event.value); // Get the selected value
    console.log(this.selected);
  }

  getIndianStandardTime(): Date {
    const utc = new Date(); // Current UTC time
    const offsetMilliseconds = 5 * 60 * 60 * 1000;
    return new Date(utc.getTime() + offsetMilliseconds);
  }

  start(rfid: string, meter_start: string) {
    let meter = Number(meter_start);
    const utc = this.getIndianStandardTime();
    console.log(utc);
    const req = generateMessage('StartTransaction', {
      connectorId: this.selected,
      idTag: rfid,
      meterStart: meter,
      timestamp: utc,
    });
    this.signalArray = signal(req);
    this.request = signal(req);
    console.log(req);
  }

  istatus: boolean = false;
  errorcodes: string[] = [
    'ErrorCode',
    'ConnectorLockFailure',
    'EVCommunicationError',
    'GroundFailure',
    'HighTemperature',
    'InternalError',
    'LocalListConflict',
    'NoError',
    'OtherError',
    'OverCurrentFailure',
    'OverVoltage',
    'PowerMeterFailure',
    'PowerSwitchFailure',
    'ReaderFailure',
    'ResetFailure',
    'UnderVoltage',
    'WeakSignal',
  ];
  statusValues: string[] = [
    'Status',
    'Available',
    'Preparing',
    'Charging',
    'SuspendedEVSE',
    'SuspendedEV',
    'Finishing',
    'Reserved',
    'Unavailable',
    'Faulted',
  ];
  status_notification(): void {
    this.clearAllElements();
    this.isAuthActive = false;
    if (this.isconnected === false) {
      this.dialog();
      return;
    }
    if (this.istatus) {
      this.istatus = false; // Remove all elements
      let inp = this.el.nativeElement.querySelector('#inp');
      inp.value = '';
      this.configuration = signal('Configuration');
    } else {
      this.istatus = true; // Show elements
      this.setVisibility('status');
      this.configuration = signal('StatusNotification');
    }
  }
  num = 0;
  error = '';
  sts = '';
  Changesocket(event: any): void {
    this.num = Number(event.value); // Get the selected value
    console.log(this.num);
  }

  Changerror(event: any): void {
    this.error = event.value; // Get the selected value
    console.log(this.error);
  }

  Changests(event: any): void {
    this.sts = event.value; // Get the selected value
    console.log(this.sts);
  }

  statusend(): void {
    const req = generateMessage('StatusNotification', {
      connectorId: this.num,
      errorCode: this.error,
      status: this.sts,
    });
    this.signalArray = signal(req);
    this.request = signal(req);
    console.log(req);
  }
  istop: boolean = false;
  stop_transaction(): void {
    this.clearAllElements();
    this.isAuthActive = false;
    if (this.isconnected === false) {
      this.dialog();
      return;
    }
    if (this.istop) {
      this.istop = false;
      let inp = this.el.nativeElement.querySelector('#inp');
      inp.value = '';
      this.configuration = signal('Configuration');
    } else {
      this.istop = true;
      this.setVisibility('stop');
      this.configuration = signal('StopTransaction');
    }
  }

  stop(idTag: string, meter_stop: string, transaction_id: string): void {
    let meter = Number(meter_stop);
    let transact = Number(transaction_id);
    const utc = this.getIndianStandardTime();
    console.log(utc);
    const req = generateMessage('StopTransaction', {
      idTag: idTag,
      meterStop: meter,
      timestamp: utc,
      transactionId: transact,
    });
    this.signalArray = signal(req);
    this.request = signal(JSON.stringify(req));
  }

  // Method to toggle visibility and ensure exclusivity
  setVisibility(option: string): void {
    this.isFormVisible = false;
    this.isdiagVisible = false;
    this.isfirmware = false;
    this.ismetervalue = false;
    this.istart = false;
    this.istatus = false;
    this.istop = false;
    this.isdata = false;

    switch (option) {
      case 'auth':
        this.isAuth = true;
        break;
      case 'form':
        this.isFormVisible = true;
        break;
      case 'diagnostics':
        this.isdiagVisible = true;
        break;
      case 'firmware':
        this.isfirmware = true;
        break;
      case 'meterValue':
        this.ismetervalue = true;
        break;
      case 'start':
        this.istart = true;
        break;
      case 'status':
        this.istatus = true;
        break;
      case 'stop':
        this.istop = true;
        break;
      case 'data':
        this.isdata = true;
        break;
      default:
        console.warn('Invalid option provided to setVisibility');
    }
  }

  selectedToggle1 = new FormControl();
  Responsemenu: boolean = false;
  response = signal('');
  clickedd = 0;
  cancelreservation: boolean = false;
  changeavailability: boolean = false;
  changeconfigs: boolean = false;
  clearcache: boolean = false;
  clearchargingprofile: boolean = false;
  datatransfer: boolean = false;
  composite: boolean = false;
  isselected: boolean = false;

  localist: boolean = false;
  remote_start: boolean = false;
  remote_stop: boolean = false;
  reservation: boolean = false;
  reset_status: boolean = false;
  sendlist: boolean = false;
  chargingprofile: boolean = false;
  triggermessage: boolean = false;
  unlockstatus: boolean = false;
  reset_firmware: boolean = false;

  changestatus = '';
  change(event: any): void {
    this.changestatus = String(event.value); // Get the selected value
    console.log(this.changestatus);
  }

  changeconfigs1 = '';
  changeconfig(event: any): void {
    this.changeconfigs1 = String(event.value);
    console.log(this.changeconfigs1);
  }

  selectedValue1: String = ''; // Class property to hold the value
  selection(): void {
    this.selectedToggle1.valueChanges.subscribe({
      next: (value: any) => {
        if (value !== null) {
          this.selectedValue1 = String(value); // Update the property
          console.log(this.selectedValue1); // Optional for debugging
        }
      },
      error: (error: any) => {
        console.error('Error:', error);
      },
    });
  }

  server_request(btn: string): void {
    if (this.isconnected === false) {
      this.dialog();
      return;
    }
    switch (btn) {
      case 'Cancel Reservation':
        if (this.cancelreservation) {
          this.cancelreservation = false;
          this.response = signal('Response');
          this.selectedToggle1 = new FormControl('');
        } else {
          this.cancelreservation = true;
          this.response = signal('Cancel Reservation');
          this.selectedToggle1 = new FormControl('');
          this.selection();
          this.setvisibility_server('CancelReservation');
        }
        break;
      case 'Change Availability':
        this.response = signal('Change Availability');
        if (this.changeavailability) {
          this.changeavailability = false;
          this.response = signal('Response');
        } else {
          this.changeavailability = true;
          this.response = signal('Change Availability');
          this.setvisibility_server('ChangeAvailability');
        }
        break;
      case 'Change Configuration':
        if (this.changeconfigs) {
          this.changeconfigs = false;
          this.response = signal('Response');
        } else {
          this.changeconfigs = true;
          this.response = signal('Change Configuration');
          this.setvisibility_server('ChangeConfiguration');
        }
        break;

      case 'Clear Cache':
        if (this.clearcache) {
          this.clearcache = false;
          this.response = signal('Response');
        } else {
          this.clearcache = true;
          this.response = signal('Clear Cache');
          this.selection();
          this.setvisibility_server('ClearCache');
        }
        break;
      case 'Clear Charging Profile':
        this.response = signal('Clear Charging Profile');
        if (this.clearchargingprofile) {
          this.clearchargingprofile = false;
          this.response = signal('Response');
        } else {
          this.clearchargingprofile = true;
          this.response = signal('Clear Charging Profile');
          this.setvisibility_server('ClearChargingProfile');
        }
        break;
      case 'Data Transfer':
        if (this.datatransfer) {
          this.datatransfer = false;
          this.response = signal('Response');
        } else {
          this.datatransfer = true;
          console.log('Data Transfer');
          this.response = signal('Data Transfer');
          this.setvisibility_server('DataTransfer');
        }
        break;
      case 'Get Composite Schedule':
        if (this.composite) {
          this.composite = false;
          this.selectedToggle1 = new FormControl('');
          this.response = signal('Response');
        } else {
          this.composite = true;
          this.selectedToggle1 = new FormControl('');
          this.response = signal('Get Composite Schedule');
          this.selection();
          this.setvisibility_server('GetCompositeSchedule');

        }
        break;
      case 'Get Configuration':
        this.response = signal('Get Configuration');

        break;
      case 'Get Diagnostics':
        this.response = signal('Get Diagnostics');
        // STATE THE OPERATION OF GETDIAGNOSTICS METHOD

        break;
      case 'Get Local List Version':
        if (this.localist) {
          this.localist = false;
          this.response = signal('Response');
        } else {
          this.localist = true;
          this.response = signal('Get Local List Version');
          this.setvisibility_server('GetLocalListVersion');

        }
        break;
      case 'Remote Start Transaction':
        if (this.remote_start) {
          this.remote_start = false;
          this.selectedToggle1 = new FormControl('');
          this.response = signal('Response');
        } else {
          this.remote_start = true;
          this.response = signal('Remote Start Transaction');
          this.selectedToggle1 = new FormControl('');
          this.selectedValue1 = '';
          this.selection();
          this.setvisibility_server('RemoteStartTransaction');

        }
        break;
      case 'Remote Stop Transaction':
        if (this.remote_stop) {
          this.remote_stop = false;
          this.selectedToggle1 = new FormControl('');
          this.response = signal('Response');
        } else {
          this.remote_stop = true;
          this.selectedToggle1 = new FormControl('');
          this.response = signal('Remote Stop Transaction');
          this.selectedValue1 = '';
          this.selection();
          this.setvisibility_server('RemoteStopTransaction');
        }

        break;
      case 'Reserve Now':
        if (this.reservation) {
          this.reservation = false;
          this.selectedToggle1 = new FormControl('');
          this.response = signal('Response');
        } else {
          this.reservation = true;
          this.selectedToggle1 = new FormControl('');
          this.response = signal('Reserve Now');
          this.selectedValue1 = '';
          this.selection();
          this.setvisibility_server('ReserveNow');

        }
        break;

      case 'Reset':
        if (this.reset_status) {
          this.reset_status = false;
          this.selectedToggle1 = new FormControl('');
          this.response = signal('Response');
        } else {
          this.reset_status = true;
          this.selectedToggle1 = new FormControl('');
          this.response = signal('Reset');
          this.selectedValue1 = '';
          this.selection();
          this.setvisibility_server('Reset');
        }
        break;
      case 'Send Local List':
        if (this.sendlist) {
          this.sendlist = false;
          this.selectedToggle1 = new FormControl('');
          this.response = signal('Response');
        } else {
          this.sendlist = true;
          this.selectedToggle1 = new FormControl('');
          this.response = signal('Send Local List');
          this.selectedValue1 = '';
          this.selection();
          this.setvisibility_server('SendLocalList');
        }
        break;
      case 'Set Charging Profile':
        if (this.chargingprofile) {
          this.chargingprofile = false;
          this.selectedToggle1 = new FormControl('');
          this.response = signal('Response');
        } else {
          this.chargingprofile = true;
          this.selectedToggle1 = new FormControl('');
          this.response = signal('Set Charging Profile');
          this.selectedValue1 = '';
          this.selection();
          this.setvisibility_server('SetChargingProfile');
        }
        break;
      case 'Trigger Message':
        if (this.triggermessage) {
          this.triggermessage = false;
          this.selectedToggle1 = new FormControl('');
          this.response = signal('Response');
        } else {
          this.triggermessage = true;
          this.selectedToggle1 = new FormControl('');
          this.response = signal('Trigger Message');
          this.selectedValue1 = '';
          this.selection();
          this.setvisibility_server('TriggerMessage');
        }
        break;
      case 'Unlock Connector':
        if (this.unlockstatus) {
          this.unlockstatus = false;
          this.selectedToggle1 = new FormControl('');
          this.response = signal('Response');
        } else {
          this.unlockstatus = true;
          this.selectedToggle1 = new FormControl('');
          this.response = signal('Unlock Connector');
          this.selectedValue1 = '';
          this.selection();
          this.setvisibility_server('UnlockConnector');
        }
        break;
      case 'Update Firmware':
        this.response = signal('Update Firmware');
        this.update();

        break;
    }
  }

  setvisibility_server(btn: string) {
    this.cancelreservation = false;
    this.changeavailability = false;
    this.changeconfigs = false;
    this.clearcache = false;
    this.clearchargingprofile = false;
    this.datatransfer = false;
    this.composite = false;
    this.localist = false;
    this.remote_start = false;
    this.remote_stop = false;
    this.reservation = false;
    this.reset_status = false;
    this.sendlist = false;
    this.chargingprofile = false;
    this.triggermessage = false;
    this.unlockstatus = false;

    switch (btn) {
      case 'CancelReservation':
        this.cancelreservation = true;
      break;
      case 'ChangeAvailability':
        this.changeavailability = true;
        break;
      case 'ChangeConfiguration':
        this.changeconfigs = true;
        break;
      case 'ClearCache':
        this.clearcache = true;
        break;
      case 'ClearChargingProfile':
        this.clearchargingprofile = true;
      break;
      case 'DataTransfer':
        this.datatransfer = true;
      break;
      case 'GetCompositeSchedule':
        this.composite = true;
      break;
      case 'GetConfiguration':
        // WILL IMPLEMENT LATER
      break;
      case 'GetDiagnostics':
      // WILL IMPLEMENT LATER
      break;
      case 'GetLocalListVersion':
        this.localist = true;
        break;
      case 'RemoteStartTransaction':
        this.remote_start = true;
        break;
      case 'RemoteStopTransaction':
        this.remote_stop = true;
        break;
      case 'ReserveNow':
        this.reservation = true;
      break;
      case 'Reset':
        this.reset_status = true;
        break;
      case 'SendLocalList':
        this.sendlist = true;
        break;
      case 'SetChargingProfile':
        this.chargingprofile = true;
        break;
      case 'TriggerMessage':
        this.triggermessage = true;
        break;
      case 'UnlockConnector':
        this.unlockstatus = true;
        break;
      case 'UpdateFirmware':
      // IMPLEMENT LATER
      break;
    }


  }

  update() {
    let res = this.generateres(this.update_uuid, {});
    this.websocketService.sendMessage(res);
    this.appendreq(res);
    console.log('sent response:', res);
  }

  cancel_reserve() {
    let res = this.generateres(this.cancel_uuid, {
      status: this.selectedValue1,
    });
    this.websocketService.sendMessage(res);
    this.appendreq(res);
    console.log('sent response:', res);
  }

  clear_cache() {
    let res = this.generateres(this.clearcache__uuid, {
      status: this.selectedValue1,
    });
    this.websocketService.sendMessage(res);
    this.appendreq(res);
    console.log('sent response:', res);
  }
  getlist(version: string) {
    let res = this.generateres(this.getlist_uuid, { listVersion: version });
    this.websocketService.sendMessage(res);
    this.appendreq(res);
    console.log('sent response:', res);
  }

  reserve_status = '';
  reserve(event: any): void {
    this.reserve_status = String(event.value);
    console.log(this.reserve_status);
  }

  reservenow(): void {
    let res = this.generateres(this.reserve_uuid, {
      status: this.reserve_status,
    });
    this.websocketService.sendMessage(res);
    this.appendreq(res);
    console.log('sent response:', res);
  }

  locallist_status = '';
  localist_state(event: any): void {
    this.locallist_status = String(event.value);
    console.log(this.locallist_status);
  }
  locallist_submit(): void {
    let res = this.generateres(this.sendlist_uuid, {
      status: this.locallist_status,
    });
    this.websocketService.sendMessage(res);
    this.appendreq(res);
    console.log('sent response:', res);
  }
  setchargingprofile_status = '';
  setchargingprofile(event: any): void {
    this.setchargingprofile_status = String(event.value);
    console.log(this.setchargingprofile_status);
  }
  setcharging_submit(): void {
    let res = this.generateres(this.setcharging_uuid, {
      status: this.setchargingprofile_status,
    });
    this.websocketService.sendMessage(res);
    this.appendreq(res);
    console.log('sent response:', res);
  }

  trigger_state = '';
  trigger(event: any): void {
    this.trigger_state = String(event.value);
    console.log(this.trigger_state);
  }

  trigger_submit(): void {
    let res = this.generateres(this.trigger_uuid, {
      status: this.trigger_state,
    });
    this.websocketService.sendMessage(res);
    this.appendreq(res);
    console.log('sent response:', res);
  }

  unlock_connector = '';
  unlock(event: any): void {
    this.unlock_uuid = String(event.value);
    console.log(this.unlock_uuid);
  }

  unlock_submit(): void {
    let res = this.generateres(this.unlock_uuid, {
      status: this.unlock_connector,
    });
    this.websocketService.sendMessage(res);
    this.appendreq(res);
    console.log('sent response:', res);
  }

  change_config() {
    let res = this.generateres(this.change_configuuid, {
      status: this.changeconfigs1,
    });
    this.websocketService.sendMessage(res);
    this.appendreq(res);
    console.log('sent response:', res);
  }
  clearprofile_status = '';
  clearprofile(event: any): void {
    this.clearprofile_status = String(event.value); // Get the selected value
    console.log(this.clearprofile_status);
  }
  clearchargingprofile_submit(): void {
    let res = this.generateres(this.clearcharging_uuid, {
      status: this.clearprofile_status,
    });
    this.websocketService.sendMessage(res);
    this.appendreq(res);
    console.log('sent response:', res);
  }

  composite_schedule(): void {
    let res = this.generateres(this.getcomposite_uuid, {
      status: this.selectedValue1,
    });
    this.websocketService.sendMessage(res);
    this.appendreq(res);
    console.log('sent response:', res);
  }

  datatransferstatus = '';
  datatransfer_status(event: any): void {
    this.datatransferstatus = String(event.value);
    console.log(this.datatransferstatus);
  }
  datatransfer_submit(data: string): void {
    let res = this.generateres(this.data_uuid, {
      status: this.datatransferstatus,
      data: data,
    });
    this.websocketService.sendMessage(res);
    this.appendreq(res);
    console.log('sent response:', res);
  }

  remote_startfunc(): void {
    let res = this.generateres(this.start_uuid, {
      status: this.selectedValue1,
    });
    this.websocketService.sendMessage(res);
    this.appendreq(res);
    console.log('sent response:', res);
  }

  remote_stopfunc(): void {
    let res = this.generateres(this.start_uuid, {
      status: this.selectedValue1,
    });
    this.websocketService.sendMessage(res);
    this.appendreq(res);
    console.log('sent response:', res);
  }

  changeavailabilityreq(): void {
    let res = this.generateres(this.change_uuid, { status: this.changestatus });
    this.websocketService.sendMessage(res);
    this.appendreq(res);
    console.log('sent response:', res);
  }

  reset(): void {
    let res = this.generateres(this.reset_uuid, {
      status: this.selectedValue1,
    });
    this.websocketService.sendMessage(res);
    this.appendreq(res);
    console.log('sent response:', res);
  }

  generateres(uuid: String, payload: Payload): string {
    const messageTypeId = 3; // Always 3
    const uniqueId = uuid; // Get appropriate a unique ID
    const formattedPayload = Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [
        key.charAt(0).toLowerCase() + key.slice(1), // Ensure camelCase keys
        value,
      ])
    );
    console.log(JSON.stringify([messageTypeId, uniqueId, formattedPayload]));
    return JSON.stringify([messageTypeId, uniqueId, formattedPayload]);
  }


}

// Define a function to generate the JSON structure
function generateMessage(action: string, payload: Payload): string {
  const messageTypeId = 2; // Always 2
  const uniqueId = uuidv4(); // Generate a unique ID
  const formattedPayload = Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [
      key.charAt(0).toLowerCase() + key.slice(1), // Ensure camelCase keys
      value,
    ])
  );
  // console.log(JSON.stringify([messageTypeId, uniqueId, action, formattedPayload]));
  return JSON.stringify([messageTypeId, uniqueId, action, formattedPayload]);
}

