import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit{
  
  imgFromUrl = false;
  imgFromFile = false;
  player!:User;
  id!: number;


  constructor(private fb: FormBuilder,private userService:UserService) {

   }
  ngOnInit(): void {
    const user = this.userService.getUser();
    if (user) {
      this.player = user;
      this.id = this.player.intraId;
    }
    
    
  }
  
  myForm: FormGroup = this.fb.group({
      imgurl: ['',Validators.pattern('^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([\\/\\w .-]*)*\\/?\\.(jpg|jpeg|png|gif)$')],
      nickname: ['',],
      twofactor:[false],
  });

  toggleTwoFactor() {
    console.log("2 FACTOR BABE");  
  }
  toggleField(checkboxId: string) {
    this.imgFromUrl = checkboxId === 'imgFromUrl' ? true : false;
    this.imgFromFile = checkboxId === 'imgFromFile' ? true : false;
  
    if (this.imgFromUrl) {
      this.myForm.get('imgfile')?.disable();
      this.myForm.get('imgurl')?.enable();
    } else if (this.imgFromFile) {
      this.myForm.get('imgurl')?.disable();
      this.myForm.get('imgfile')?.enable();
    }
  }
  
  toggleFieldFile() {
    this.imgFromFile = !this.imgFromFile;
    this.imgFromUrl = false;
  
    if (this.imgFromFile) {
      this.myForm.get('imgurl')?.disable();
      this.myForm.get('imgfile')?.enable();
    } else {
      this.myForm.get('imgfile')?.disable();
    }
  }

  onSubmit() {
    if (this.imgFromUrl && this.myForm.value.imgurl)
    {
      try {
        this.userService.updateUser( this.player,
         ()=> 
          {
            this.player.avatarUrl = this.myForm.value.imgurl;
            localStorage.removeItem('user');
            localStorage.setItem('user', JSON.stringify(this.player));
          }, {avatarUrl: this.myForm.value.imgurl} );
        } catch (error) {
        console.error('Error updating user:', error);
        }
    }
    if (this.myForm.value.nickname && this.myForm.value.nickname.trim() !== '')
    {
      try {
        this.userService.updateUser( this.player,
          ()=> 
           {
             this.player.avatarUrl = this.myForm.value.imgurl;
             localStorage.removeItem('user');
             localStorage.setItem('user', JSON.stringify(this.player));
           }, {avatarUrl: this.myForm.value.imgurl} );
         } catch (error) {
         console.error('Error updating user:', error);
         }
    }
    console.log(this.myForm.value);
    this.myForm.reset(); 
  }

  onUpdate() {
    try {
      this.userService.updateUser( this.player,
        ()=> 
         {
           this.player.avatarUrl = this.myForm.value.imgurl;
           localStorage.removeItem('user');
           localStorage.setItem('user', JSON.stringify(this.player));
         }, {avatarUrl: this.myForm.value.imgurl} );
       } catch (error) {
       console.error('Error updating user:', error);
       }
  }
  
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    // Dosyanın resim formatında olup olmadığını kontrol et
    if (!file.type.match('image.*')) {
      // Uyarı mesajı göster
      alert('Please select an image file.');
      return;
    }
  
    const maxSize = 50 * 1024 ;
    if (file.size > maxSize) {
      // Dosya boyutu sınırı aştı, uyarı mesajı göster
      alert('The selected file is too large. Please choose a smaller file.');
      return;
    }
  
    reader.onload = (e: any) => {
      this.player.avatarUrl = e.target.result;
    };
  
    reader.readAsDataURL(file);
  }
  
  




  onCancel() {
    this.myForm.reset(); 
  }

}