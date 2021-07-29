import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { RegisterPageComponent } from './components/register-page/register-page.component';

import { MembersComponent } from './components/members-components/members/members.component';
import { SearchfilterPipe } from './searchfilter.pipe';
import { ProductsComponent } from './components/products/products.component';
import { AddMemberComponent } from './components/members-components/add-member/add-member.component';
import { UpdateMemberComponent } from './components/members-components/update-member/update-member.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from './shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MachinesComponent } from './components/machines-components/machines/machines.component';
import { CreateMachineComponent } from './components/machines-components/create-machine/create-machine.component';
import { EditMachineComponent } from './components/machines-components/edit-machine/edit-machine.component';
import { MachinesTableComponent } from './components/machines-components/machines-table/machines-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { NavComponent } from './components/nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { HomeComponent } from './components/home/home.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MembersChartComponent } from './components/members-chart/members-chart.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MembersPageComponent } from './components/members-components/members-page/members-page.component';
import { MembersTableComponent } from './components/members-components/members-table/members-table.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'members', component: MembersPageComponent, canActivate: [AuthGuard] },
  { path: 'machines', component: MachinesComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },

  //TODO: make 404 page
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterPageComponent,
    MembersComponent,
    SearchfilterPipe,
    ProductsComponent,
    AddMemberComponent,
    UpdateMemberComponent,
    MachinesComponent,
    CreateMachineComponent,
    EditMachineComponent,
    MachinesTableComponent,
    NavComponent,
    HomeComponent,
    MembersChartComponent,
    MembersPageComponent,
    MembersTableComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
