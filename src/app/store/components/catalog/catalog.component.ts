import { Component, OnInit, NgZone } from '@angular/core';
import { Movie, Book } from 'src/app/models/movie';
import { Wishlist } from 'src/app/models/wishlist';
import { Cart } from 'src/app/models/cart';
import { ProductService } from 'src/app/shared/services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IpServiceService } from 'src/app/shared/services/ip-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  ProductsList: any = [];
  List: any = [];
  WishList: any = [];
  CartList: any = [];
  updateMovie: Movie;
  updateBook: Book;
  loading = false;
  ipAddress: string;
  category;
  p: number = 1;

  constructor(
    private productService: ProductService,
    private ip: IpServiceService,
    private actRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.actRoute.params.subscribe((params) => {
      this.category = params['category'];
      if (this.category === 'Movie') {
        this.loadMovies();
      } else if (this.category === 'Book') {
        this.loadBooks();
      }
    });
  }

  loadMovies() {
    this.loading = true;
    this.productService.GetMovies().subscribe((data: {}) => {
      this.ProductsList = data;
      this.getIP();
    });
  }

  loadBooks() {
    this.productService.GetBooks().subscribe((data: {}) => {
      this.ProductsList = data;
      this.getIP();
    });
  }

  getIP() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
      this.loadCartProducts();
    });
  }

  loadCartProducts() {
    this.productService.GetCartProducts().subscribe((data: {}) => {
      this.CartList = data;
      this.productService.cartCount = this.CartList.length;
      this.loadWishlist();
    });
  }

  loadWishlist() {
    return this.productService.GetWishlist().subscribe((data: {}) => {
      this.WishList = data;
      var list = this.WishList.filter(
        (element) => element.ipAddress === this.ipAddress
      );
      this.productService.wishListCount = list.length;
      this.findProductList();
    });
  }

  findProductList() {
    for (let i = 0; i < this.ProductsList.length; i++) {
      var product = this.WishList.find(
        (e) =>
          e.productId === this.ProductsList[i].id &&
          e.ipAddress === this.ipAddress &&
          e.category === this.ProductsList[i].category
      );
      if (product != null) {
        this.ProductsList[i].inWishlist = true;
      }
      var cPro = this.CartList.find(
        (e) =>
          e.productId === this.ProductsList[i].id &&
          e.category === this.ProductsList[i].category
      );
      if (cPro != null) {
        this.ProductsList[i].inCart = true;
      }
    }
  }

  addToCart(product) {
    var list = this.CartList.filter(
      (element) =>
        element.category === product.category &&
        element.productId === product.id
    );
    if (list.length === 0) {
      var cartitem: { [k: string]: any } = {};
      cartitem.productId = product.id;
      cartitem.category = product.category;
      cartitem.cartQuantity = 1;

      this.productService.AddToCart(cartitem).subscribe((data) => {
        this.loadCartProducts();
        product.inCart = true;
        console.log('Added in Cart');
      });
      this.snackBar.open(product.name + ' added to Cart', '', {
        horizontalPosition: 'right',
        duration: 3000,
        panelClass: 'snack-success',
      });
    } else {
      this.productService.RemoveCartProduct(list[0].id).subscribe((data) => {
        this.loadCartProducts();
        product.inCart = false;
        console.log('Remove from Cart');
      });
      this.snackBar.open(product.name + ' removed from Cart', '', {
        horizontalPosition: 'right',
        duration: 3000,
        panelClass: ['snack-error'],
      });
    }
  }

  addToWishList(product) {
    var list = this.WishList.filter(
      (element) =>
        element.category === product.category &&
        element.ipAddress === this.ipAddress &&
        element.productId === product.id
    );
    if (list.length === 0) {
      var wishlist: { [k: string]: any } = {};
      wishlist.productId = product.id;
      wishlist.category = product.category;
      wishlist.ipAddress = this.ipAddress;

      this.productService.AddToWishList(wishlist).subscribe((data) => {
        this.loadWishlist();
        product.inWishlist = true;
        console.log('Added in wisllist');
      });
      this.snackBar.open(product.name + ' added to wishlist', '', {
        horizontalPosition: 'right',
        duration: 3000,
        panelClass: 'snack-success',
      });
    } else {
      this.productService.RemoveFromWishList(list[0].id).subscribe((data) => {
        this.loadWishlist();
        product.inWishlist = false;
        console.log('Remove from wisllist');
      });
      this.snackBar.open(product.name + ' removed from wishlist', '', {
        horizontalPosition: 'right',
        duration: 3000,
        panelClass: ['snack-error'],
      });
    }
  }
}
