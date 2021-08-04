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
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatRadioModule } from '@angular/material/radio';
import { SchedulerPageComponent } from './components/scheduler-components/scheduler-page/scheduler-page.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MachineDetailsComponent } from './components/scheduler-components/machine-details/machine-details.component';
import { UpdateScheduledJobComponent } from './components/scheduler-components/update-scheduled-job/update-scheduled-job.component';
import { MatDividerModule } from '@angular/material/divider';
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NgxMatNativeDateModule,
} from '@angular-material-components/datetime-picker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AddScheduledJobPageComponent } from './components/scheduler-components/add-scheduled-job-page/add-scheduled-job-page.component';
import { ProductsPageComponent } from './components/products-components/products-page/products-page.component';
import { AddProductComponent } from './components/products-components/add-product/add-product.component';
import { UpdateProductPageComponent } from './components/products-components/update-product-page/update-product-page.component';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatSelectModule } from '@angular/material/select';
// import {
//   MatDatepicker,
//   MatDatepickerModule,
// } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'members',
    component: MembersPageComponent,
    canActivate: [AuthGuard],
  },
  { path: 'machines', component: MachinesComponent, canActivate: [AuthGuard] },
  {
    path: 'products',
    component: ProductsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'scheduler',
    component: SchedulerPageComponent,
    canActivate: [AuthGuard],
  },
  //TODO: make 404 page
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterPageComponent,
    MembersComponent,
    SearchfilterPipe,
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
    SchedulerPageComponent,
    MachineDetailsComponent,
    UpdateScheduledJobComponent,
    AddScheduledJobPageComponent,
    ProductsPageComponent,
    AddProductComponent,
    UpdateProductPageComponent,
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
    FlexLayoutModule,
    MatRadioModule,
    ScrollingModule,
    MatDividerModule,
    MatSlideToggleModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
  ],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
