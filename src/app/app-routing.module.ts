import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogComponent } from './store/components/catalog/catalog.component';
import { CartComponent } from './store/components/cart/cart.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { WishlistComponent } from './store/components/wishlist/wishlist.component';
import { DetailsComponent } from './store/components/details/details.component';
import { CheckoutComponent } from './store/components/checkout/checkout.component';
import { AuthguardService } from './shared/services/authguard.service';


const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'catalog', loadChildren: () => import('./store/store.module').then(m => m.StoreModule) },
  { path: 'cart', component: CartComponent },
  { path: 'wishlist', component: WishlistComponent },
  {
    path: 'productdetails/:id/:category',
    component: DetailsComponent
  },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthguardService] },
  { path: '**', component: WelcomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
