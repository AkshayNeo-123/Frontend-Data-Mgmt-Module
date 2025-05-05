import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactsService } from '../../../services/contacts.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Console } from 'console';
import { MatRadioModule } from '@angular/material/radio';
import { ToastrService } from 'ngx-toastr';
import { ContactTyps } from '../../../models/contacts';

@Component({
  selector: 'app-addcontacts',
  templateUrl: './addcontacts.component.html',
  styleUrls: ['./addcontacts.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatRadioModule
  ]
})
export class AddcontactsComponent implements OnInit {
  contactForm!: FormGroup;
  isEditMode: boolean = false;
  filteredCities: string[] = [];
  constructor(
    private fb: FormBuilder,
    private contactService: ContactsService,
    private dialogRef: MatDialogRef<AddcontactsComponent>,
        private toastr:ToastrService
    ,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    console.log('Data passed to dialog:', this.data);
    this.isEditMode = !!this.data;
    console.log("See the data ", this.data);
    
    // Initialize the contact form
    this.contactForm = this.fb.group({
      contactId: [this.data?.contactId || null],
  
      contactName: [this.data?.contactName || '', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]],
  
      contactType: [this.isEditMode ? this.data?.contactType : 1, Validators.required],   
      addressLine1: [this.data?.addressLine1 || '', Validators.required],

      addressLine2: [this.data?.addressLine1 || ''],

      city: [this.data?.city || '', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]+$/),
      ]],
  
      state: [this.data?.state || '', Validators.required],
  
      zip: [this.data?.zip || '', [
        Validators.required,
        Validators.pattern(/^[0-9]{5,6}$/)
      ]],
  
      email: [this.data?.email || '', [
        Validators.required,
        Validators.email
      ]],
  
      phone: [this.data?.phone || '', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]]
    });
  
    if (this.data?.state) {
      this.onStateChange(this.data.state);  
    }
  }
  
  allowOnlyNumber(event: KeyboardEvent): void {
    const char = event.key;
    if (!/^[0-9]$/.test(char)) {
      event.preventDefault();
    }
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  allowOnlyLetters(event: KeyboardEvent): void {
    const char = event.key;
    const isLetterOrSpace = /^[a-zA-Z\s]$/.test(char);
    if (!isLetterOrSpace) {
      event.preventDefault();
    }
  }
  

  onSubmit(): void {
    this.contactForm.markAllAsTouched();

     
    if (this.contactForm.invalid) {
      this.toastr.error(
        'Please fill all required fields.',
        'Error',
        { timeOut: 5000 }
      );
      return; 
    }

    if (this.contactForm.valid) {
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;

      if (!user) {
        console.error('No user found in localStorage!');
        return;
      }

      const contactPayload = {
        ...this.contactForm.value,
        createdBy: user.userId,
        createdDate: new Date().toISOString(),
      };

      if (this.isEditMode) {
        console.log(this.data.contactId,contactPayload)
        console.log('Updating contact with ID:', this.data.contactId);
        this.contactService.updateContact(this.data.contactId, contactPayload).subscribe({
          next: () => {
            // alert('Contact updated');
            this.dialogRef.close(true);
          },
          error: (err) => console.error('Update failed', err)
        });
      } else {
        console.log('Adding new contact');
        this.contactService.addContacts(contactPayload).subscribe({
          next: () => {
            // alert('Contact added');
            this.dialogRef.close(true);
          },
          error: (error)=>{
            console.error('save error:',error);
          
          // this.toastr.error('Failed to add contact','error',{
            //  timeOut:5000
          // });
        }
        });
      }
    }
  }

 
  states = [
    { value: 'CA', viewValue: 'California' },
    { value: 'TX', viewValue: 'Texas' },
    { value: 'NY', viewValue: 'New York' },
    { value: 'FL', viewValue: 'Florida' },
    { value: 'IL', viewValue: 'Illinois' },
    { value: 'WA', viewValue: 'Washington' },
  
    { value: 'ON', viewValue: 'Ontario' },
    { value: 'QC', viewValue: 'Quebec' },
    { value: 'BC', viewValue: 'British Columbia' },
    { value: 'AB', viewValue: 'Alberta' },
    { value: 'MB', viewValue: 'Manitoba' },
  
    { value: 'MH', viewValue: 'Maharashtra' },
    { value: 'DL', viewValue: 'Delhi' },
    { value: 'KA', viewValue: 'Karnataka' },
    { value: 'TN', viewValue: 'Tamil Nadu' },
    { value: 'WB', viewValue: 'West Bengal' },
    { value: 'RJ', viewValue: 'Rajasthan' },
  
    { value: 'NSW', viewValue: 'New South Wales' },
    { value: 'VIC', viewValue: 'Victoria' },
    { value: 'QLD', viewValue: 'Queensland' },
    { value: 'WA-AU', viewValue: 'Western Australia' },
    { value: 'SA', viewValue: 'South Australia' },
  
    { value: 'ENG', viewValue: 'England' },
    { value: 'SCT', viewValue: 'Scotland' },
    { value: 'WLS', viewValue: 'Wales' },
    { value: 'NIR', viewValue: 'Northern Ireland' }
  ];

  citiesByState: { [key: string]: string[] } = {
    'CA': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose'],
    'TX': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
    'NY': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'],
    'FL': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
    'IL': ['Chicago', 'Aurora', 'Naperville', 'Peoria', 'Rockford'],
    'WA': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue'],
  
    'ON': ['Toronto', 'Ottawa', 'Hamilton', 'Mississauga', 'London'],
    'QC': ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Sherbrooke'],
    'BC': ['Vancouver', 'Victoria', 'Richmond', 'Burnaby', 'Kelowna'],
    'AB': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat'],
    'MB': ['Winnipeg', 'Brandon', 'Steinbach', 'Thompson', 'Portage la Prairie'],
  
    'MH': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane'],
    'DL': ['New Delhi', 'Dwarka', 'Rohini', 'Connaught Place', 'Karol Bagh'],
    'KA': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Bijapur'],
    'TN': ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem'],
    'WB': ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur', 'Asansol'],
    'RJ': ['Jaipur', 'Udaipur', 'Jodhpur', 'Kota', 'Ajmer'],
  
    'NSW': ['Sydney', 'Newcastle', 'Wollongong', 'Maitland', 'Coffs Harbour'],
    'VIC': ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Shepparton'],
    'QLD': ['Brisbane', 'Gold Coast', 'Cairns', 'Townsville', 'Sunshine Coast'],
    'WA-AU': ['Perth', 'Mandurah', 'Bunbury', 'Geraldton', 'Albany'],
    'SA': ['Adelaide', 'Mount Gambier', 'Murray Bridge', 'Whyalla', 'Port Augusta'],
  
    'ENG': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds'],
    'SCT': ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Perth'],
    'WLS': ['Cardiff', 'Swansea', 'Newport', 'Bangor', 'Wrexham'],
    'NIR': ['Belfast', 'Derry', 'Lisburn', 'Newtownabbey', 'Armagh']
  };
  onStateChange(selectedState: string): void {
    this.filteredCities = this.citiesByState[selectedState] || [];
    // this.contactForm.patchValue({ city: '' }); 
  }
    
   onCancel() {
    this.dialogRef.close(false);
  }
  
}
