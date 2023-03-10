import { Component, OnInit, Output } from '@angular/core';
import { PostService } from '../post/post.service';
import { User } from 'src/app/auth/auth-response';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { Messaggi } from '../post/post';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
[x: string]: any;

  users: User[] =[]
  messaggi:any
  id:number;
  buttonCollapse: any;
  chat: any

  constructor(private postSrv:PostService) { }

  ngOnInit(): void {
    this.getChatUser();
  }

  getChatUser() {
  this.postSrv.prendiUtentiChat().subscribe((res) => {
    let utenti = res
    console.log(utenti);
  let user = localStorage.getItem('user')
    let utenteLoggato = JSON.parse(user)
   for (let i =0; i< utenti.length; i++){
     console.log(utenteLoggato.user.id);
      if(utenti[i].id==utenteLoggato.user.id) {
        utenti.splice(i,1)
        this.users=utenti
      }
    }
    this.getAllChat();
  })
  }

  getAllChat() {
    this.postSrv.recieveMessagge().subscribe((res => {
      console.log(res);
      this.chat = res
      this.chat.forEach(msg => {
        this.users.forEach(user =>{
          if(user.id == msg.senderId){
            if(msg.pending == true) {
              console.log("funziono")
              user.pending = true
            }
          }
        })
      });
    }))
  }

  clearPending(id:number) {
    this.chat.forEach(msg => {
      if(msg.senderId == id) {
        msg.pending = false
        this.postSrv.aggiornaMsg(msg).subscribe(res =>{
          console.log("pendingInviato");
          this.getChatUser()
        })
      }
    })
  }

}
