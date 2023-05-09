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
  fileChanged = false;


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
      nickname: ['', Validators.pattern(/^[a-zA-Z][a-zA-Z0-9]{3,9}$/)],
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
  

  onSubmit() {
    if (this.imgFromUrl && this.myForm.value.imgurl)
    {
        this.userService.updateUser(this.player, () => {
          this.player.avatarUrl = this.myForm.value.imgurl;
          localStorage.removeItem('user');
          localStorage.setItem('user', JSON.stringify(this.player));
          
          return { avatarUrl: this.myForm.value.imgurl };
        },  this.myForm.value.imgurl);
    }
    if (this.myForm.value.nickname && this.myForm.value.nickname.trim() !== '')
    {
        this.userService.updateUser(this.player, () => {
          this.player.nickname = this.myForm.value.nickname;
          localStorage.removeItem('user');
          localStorage.setItem('user', JSON.stringify(this.player));
          return { nickname: this.myForm.value.nickname };
        },  this.myForm.value.nickname);
    }
    console.log(this.myForm.value);
    this.myForm.reset(); 
  }

  onUpdate() {
  if (this.fileChanged){
    
    this.userService.updateUser(this.player, () => {
      localStorage.removeItem('user');
      localStorage.setItem('user', JSON.stringify(this.player));
   /*   if (this.fileChanged) {
     */   // Dosya input alanını sıfırla
        const inputEl = document.getElementById('imgfile') as HTMLInputElement;
        inputEl.value = '';
        this.fileChanged = false;
     // }
      return { avatarUrl: this.player.avatarUrl };
    },  this.player.avatarUrl);
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
      this.fileChanged = true;
    };
  
    reader.readAsDataURL(file);
  }
  

  onCancel() {
    this.myForm.reset(); 
  }

}
