import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { MembersComponent } from './components/members-components/members/members.component';
import { SearchfilterPipe } from './searchfilter.pipe';
import { ProductsComponent } from './components/products/products.component';
import { AddMemberComponent } from './components/members-components/add-member/add-member.component';
import { UpdateMemberComponent } from './components/members-components/update-member/update-member.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from './shared/shared.module';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'members', component: MembersComponent, canActivate: [AuthGuard] },
  //TODO: make 404 page
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomePageComponent,
    RegisterPageComponent,
    NavBarComponent,
    MembersComponent,
    SearchfilterPipe,
    ProductsComponent,
    AddMemberComponent,
    UpdateMemberComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
