import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { map } from 'rxjs/Operators';
import { Subscription } from 'rxjs';
import { Post } from './post.model';
import { PostsService } from './posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPost: Post[] = [];
  isFetching = false;
  error= null;
  private errorSub: Subscription;

  constructor (private http: HttpClient, private postsService: PostsService) {}

  ngOnInit() {
    this.errorSub = this.postsService.error.subscribe(errorMessage =>{
      this.error = errorMessage;
    });

    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(post => {
      this.isFetching = false;
      this.loadedPost= post;
    }, error => {
      this.isFetching = false;
      this.error = error.message;
    });
  }

  onCreatePost(postData: Post) {
    //send Http request
    this.postsService.createAndStorePost(postData.title, postData.content);
}
 onFetchPosts() {
  this.isFetching = true;
  this.postsService.fetchPosts().subscribe(post => {
    this.isFetching = false;
    this.loadedPost= post;
  }, error => {
    this.isFetching = false;
    this.error = error.message;
    console.log(error);
    
  });
 }
 onClearPosts() {
   this.postsService.deletaPosts().subscribe(() => {
     this.loadedPost = [];
   });

 }

 onHandleEror() {
   this.error = null;
 }

 ngOnDestroy() {
   this.errorSub.unsubscribe();
 }

}