import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/shared/services/product.service';
import { Movie } from 'src/app/models/movie';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IpServiceService } from 'src/app/shared/services/ip-service.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  product: any;
  imgURL = '../../../assets/images/image1.png';
  loading = false;
  WishList: any = [];
  CartList: any = [];
  ipAddress: string;

  ngOnInit() {
    this.loadProducts();
    this.getIP();
  }

  constructor(
    public productService: ProductService,
    private actRoute: ActivatedRoute,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private ip: IpServiceService
  ) { }

  getIP() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
      this.loadCartProducts();
    });
  }

  loadProducts() {
    this.loading = true;
    var id = this.actRoute.snapshot.paramMap.get('id');
    var category = this.actRoute.snapshot.paramMap.get('category');

    if (category === "Movie") {
      return this.productService.GetMovie(id).subscribe((data: {}) => {
        this.product = data;
      })
    }
    else {
      return this.productService.GetBook(id).subscribe((data: {}) => {
        this.product = data;
      })
    }
  }

  loadCartProducts() {
    return this.productService.GetCartProducts().subscribe((data: {}) => {
      this.CartList = data;
      this.productService.cartCount = this.CartList.length;
      this.loadWishlist();
    })
  }

  loadWishlist() {
    this.productService.GetWishlist().subscribe((data: {}) => {
      this.WishList = data;
      var list = this.WishList.filter(element => element.ipAddress === this.ipAddress);
      this.productService.wishListCount = list.length;
      this.findProduct();
    })
  }

  findProduct() {
    var product = this.WishList.find(e => e.productId === this.product.id && e.ipAddress === this.ipAddress
      && e.category === this.product.category);
    if (product != null) {
      this.product.inWishlist = true;
    }
    var cPro = this.CartList.find(e => e.productId === this.product.id
      && e.category === this.product.category);
    if (cPro != null) {
      this.product.inCart = true;
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

  addToWishList(product) {
    var list = this.WishList.filter(element =>
      element.category === product.category
      && element.ipAddress === this.ipAddress
      && element.productId === product.id
    );
    if (list.length === 0) {
      var wishlist: { [k: string]: any } = {};
      wishlist.productId = product.id;
      wishlist.category = product.category;
      wishlist.ipAddress = this.ipAddress;

      this.productService.AddToWishList(wishlist).subscribe(data => {
        this.loadWishlist();
        product.inWishlist = true;
        console.log("Added in wisllist");
      });
      this.snackBar.open(product.name + ' added to wishlist', '', {
        horizontalPosition: 'right',
        duration: 3000,
        panelClass: 'snack-success'
      });
    }
    else {
      this.productService.RemoveFromWishList(list[0].id).subscribe(data => {
        this.loadWishlist();
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


  openDialog(product): void {
    this.dialog.open(AppMovieDialogComponent, {
      height: '500px',
      width: '800px',
      data: { video: product }
    });
  }

  openBookDialog(product): void {
    this.dialog.open(AppMovieDialogComponent, {
      height: '650px',
      width: '1200px',
      data: { video: product }
    });
  }

}

@Component({
  selector: 'app-movie-dialog',
  template: `
  <div>
  {{data.video.name}}
  <a href="javascipt:void(0)" style="float: right">
    <i class="fa fa-times" aria-hidden="true" (click)="closeDialog()"></i></a> </div>
    <iframe *ngIf="data.video.category == 'Movie'; else Book" [src]="sanitizer.bypassSecurityTrustResourceUrl(data.video.trailer)" allowfullscreen width="99.4%" height="420px"></iframe>
  <ng-template #Book>
  <iframe [src]="sanitizer.bypassSecurityTrustResourceUrl(data.video.preview)" allowfullscreen width="99%" height="99%"></iframe>
  </ng-template >
`
})
export class AppMovieDialogComponent {

  // 

  constructor(
    public dialogRef: MatDialogRef<AppMovieDialogComponent>,
    public sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data.video.preview + "....");
  }

  closeDialog() {
    this.dialogRef.close('Pizza!');
  }



}
