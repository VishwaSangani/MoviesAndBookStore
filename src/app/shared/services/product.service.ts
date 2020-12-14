import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Movie, Book } from '../../models/movie';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Cart } from 'src/app/models/cart';
import { Wishlist } from 'src/app/models/wishlist';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseurl = 'https://moviesandbooksapi.herokuapp.com';
  public wishListCount = 0;
  public cartCount = 0;

  constructor(private http: HttpClient) {}

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  // GET
  GetMovie(id): Observable<Movie> {
    return this.http
      .get<Movie>(this.baseurl + '/movies/' + id)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // GET
  GetMovies(): Observable<Movie> {
    return this.http
      .get<Movie>(this.baseurl + '/movies/')
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // PUT
  UpdateMovie(id, data): Observable<Movie> {
    return this.http
      .put<Movie>(
        this.baseurl + '/movies/' + id,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // GET
  GetBook(id): Observable<Book> {
    return this.http
      .get<Book>(this.baseurl + '/books/' + id)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // GET
  GetBooks(): Observable<Book> {
    return this.http
      .get<Book>(this.baseurl + '/books/')
      .pipe(retry(1), catchError(this.errorHandl));
  }

  UpdateBook(id, data): Observable<Book> {
    return this.http
      .put<Book>(
        this.baseurl + '/books/' + id,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // GET
  GetCartProducts(): Observable<Cart> {
    return this.http
      .get<Cart>(this.baseurl + '/cart/')
      .pipe(retry(1), catchError(this.errorHandl));
  }

  //GET
  GetCartItem(id): Observable<Cart> {
    return this.http
      .get<Cart>(this.baseurl + '/cart/' + id)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // POST
  AddToCart(data): Observable<Cart> {
    return this.http
      .post<Cart>(
        this.baseurl + '/cart/',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // DELETE
  RemoveCartProduct(id) {
    return this.http
      .delete<Cart>(this.baseurl + '/cart/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  UpdateCartItem(id, data): Observable<Cart> {
    return this.http
      .put<Cart>(
        this.baseurl + '/cart/' + id,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  //wishlist
  // GET
  GetWishlist(): Observable<Movie> {
    return this.http
      .get<Movie>(this.baseurl + '/wishlist/')
      .pipe(retry(1), catchError(this.errorHandl));
  }

  //post
  AddToWishList(data): Observable<Wishlist> {
    return this.http
      .post<Wishlist>(
        this.baseurl + '/wishlist/',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  //delete
  RemoveFromWishList(id) {
    return this.http
      .delete<Wishlist>(this.baseurl + '/wishlist/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // Error handling
  errorHandl(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
