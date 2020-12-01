import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { IpServiceService } from 'src/app/shared/services/ip-service.service';
import { Wishlist } from 'src/app/models/wishlist';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  ProductsList: any = [];
  wishlist: Wishlist[];
  CartList: any = [];
  list: any = [];
  ipAddress: string;
  Movies: any = [];
  Books: any = [];
  category: string;
  p: number = 1;

  constructor(
    private productService: ProductService,
    private ip: IpServiceService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getIP();
    this.loadCartProducts();
  }

  getIP() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
      this.loadMovies();
    });
  }

  loadMovies() {
    this.productService.GetMovies().subscribe((data: any) => {
      this.Movies = data;
      this.loadBooks();
    });
  }

  loadBooks() {
    this.productService.GetBooks().subscribe((data: any) => {
      this.Books = data;
      this.loadWishlistProducts();
    });

  }

  loadWishlistProducts() {
    this.productService.GetWishlist().subscribe((data: {}) => {
      this.list = data;
      var list = this.list.filter(element => element.ipAddress === this.ipAddress);
      this.productService.wishListCount = list.length;
      this.findwishlist();
    });
  }

  loadCartProducts() {
    this.productService.GetCartProducts().subscribe((data: {}) => {
      this.CartList = data;
      this.productService.cartCount = this.CartList.length;
    })
  }

  findwishlist() {
    this.wishlist = this.list.filter(e => e.ipAddress === this.ipAddress);
    this.productService.wishListCount = this.wishlist.length;
    for (let i = 0; i <= this.wishlist.length - 1; i++) {
      this.category = this.wishlist[i].category;
      if (this.category == 'Movie') {
        var movie = this.Movies.filter(e => e.id === this.wishlist[i].productId);
        if (movie != null) {
          var item = this.CartList.find(e => e.productId === movie[0].id && e.category === "Movie")
          if (item != null) {
            movie[0].inCart = true;
          }
          this.ProductsList.push(movie[0]);
        }
      }
      else {
        var book = this.Books.filter(e => e.id === this.wishlist[i].productId);
        console.log(book + "book")
        if (book != null) {
          var item = this.CartList.find(e => e.productId === book[0].id && e.category === "Book")
          if (item != null) {
            book[0].inCart = true;
          }
          this.ProductsList.push(book[0]);
        }
      }
    }

  }

  addToCart(product) {
    var list = this.CartList.filter(element =>
      element.category === product.category
      && element.productId === product.id
    );
    if (list.length === 0) {
      var cartitem: { [k: string]: any } = {};
      cartitem.productId = product.id;
      cartitem.category = product.category;
      cartitem.cartQuantity = 1;

      this.productService.AddToCart(cartitem).subscribe(data => {
        this.loadCartProducts();
        product.inCart = true;
        console.log("Added in Cart");
      });
      this.snackBar.open(product.name + ' added to Cart', '', {
        horizontalPosition: 'right',
        duration: 3000,
        panelClass: 'snack-success'
      });
    }
    else {
      this.productService.RemoveCartProduct(list[0].id).subscribe(data => {
        this.loadCartProducts();
        product.inCart = false;
        console.log("Remove from Cart");
      });
      this.snackBar.open(product.name + ' removed from Cart', '', {
        horizontalPosition: 'right',
        duration: 3000,
        panelClass: ['snack-error']
      });
    }
  }

  removeFromWishList(product, index) {
    var list = this.list.filter(element =>
      element.category === product.category
      && element.ipAddress === this.ipAddress
      && element.productId === product.id
    );
    console.log("ID::::" + list.length);
    if (list.length != 0) {
      this.productService.RemoveFromWishList(list[0].id).subscribe(data => {
        this.ProductsList.splice(index, 1);
        this.productService.wishListCount -= 1;
        product.inWishlist = false;
        console.log("Remove from wisllist");
      });
      this.snackBar.open(product.name + ' removed from wishlist', '', {
        horizontalPosition: 'right',
        duration: 3000,
        panelClass: ['snack-error']
      });
    }
  }
}
