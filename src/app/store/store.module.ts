import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreRoutingModule } from './store-routing.module';
import { CatalogComponent } from './components/catalog/catalog.component';
import { DetailsComponent, AppMovieDialogComponent } from './components/details/details.component';
import { ProductService } from '../shared/services/product.service';
import { MaterialModule } from '../material/material.module';
import { IpServiceService } from '../shared/services/ip-service.service';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { CartComponent } from './components/cart/cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutComponent, DialogOverviewExampleDialog } from './components/checkout/checkout.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  // entryComponents: [ DialogOverviewExampleDialog ] ,
  declarations: [
    CatalogComponent,
    DetailsComponent,
    WishlistComponent,
    CartComponent,
    AppMovieDialogComponent,
    CheckoutComponent,
    DialogOverviewExampleDialog
  ],
  imports: [
    CommonModule,
    StoreRoutingModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers: [IpServiceService],
  exports: [
    CatalogComponent,
    DetailsComponent,
    WishlistComponent,
    CartComponent,
    AppMovieDialogComponent,
    CheckoutComponent,
    DialogOverviewExampleDialog
  ]
})
export class StoreModule { }
