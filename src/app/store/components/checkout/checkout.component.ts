import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  userDetails;
  ProductsList: any = [];
  cartList: any = [];
  Movies: any = [];
  Books: any = [];
  category: string;
  totalAmount = 0;
  otp;

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('UserDetails'));
    console.log(this.userDetails.username + "Checkout");
    this.loadMovies();
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
      this.loadCartProducts();
    });

  }

  loadCartProducts() {
    this.productService.GetCartProducts().subscribe((data: {}) => {
      this.cartList = data;
      this.findCart();
    });

  }

  findCart() {

    for (let i = 0; i <= this.cartList.length - 1; i++) {
      this.category = this.cartList[i].category;
      if (this.category === 'Movie') {
        let movie = this.Movies.filter(e => e.id === this.cartList[i].productId);
        movie[0].Cartqty = this.cartList[i].cartQuantity;
        this.totalAmount += movie[0].amount;
        this.ProductsList.push(movie[0]);
      }
      else {
        let book = this.Books.filter(e => e.id === this.cartList[i].productId);
        book[0].Cartqty = this.cartList[i].cartQuantity;
        this.totalAmount += book[0].amount;
        this.ProductsList.push(book[0]);
      }
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: { username: this.userDetails.username }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.otp = result;

      if (this.otp == 778899) {
        this.snackBar.open('Thank You. Checkout Successful.', '', {
          horizontalPosition: 'right',
          duration: 3000,
          panelClass: 'snack-success',
        }).afterDismissed().subscribe(() => {
          this.router.navigate(['/welcome']);
        });
        this.clearCart();
      }
      else {
        this.snackBar.open('Sorry, You entered wrong OTP', '', {
          horizontalPosition: 'right',
          duration: 3000,
          panelClass: ['snack-error']
        });
      }
    });
  }

  clearCart() {
    for (let i = 0; i < this.cartList.length; i++) {
      this.productService.RemoveCartProduct(this.cartList[i].id).subscribe(res => {
      });
    }
    this.productService.cartCount = 0;
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
  <h1 mat-dialog-title>Hi {{data.username}}</h1>
<div mat-dialog-content>
  <mat-form-field>
    <mat-label>Enter OTP</mat-label>
    <input matInput [(ngModel)]="data.otp">
  </mat-form-field>
</div>
<div mat-dialog-actions>
  <button mat-button (click)="onNoClick()">No Thanks</button>
  <button mat-button [mat-dialog-close]="data.otp" cdkFocusInitial>Ok</button>
</div>`,
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
