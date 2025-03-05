import { Routes } from '@angular/router';
import { InventoryComponent } from './components/inventory/inventory.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SalesComponent } from './components/sales/sales.component';
import { InvoiceComponent } from './components/invoice/invoice.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'invoice', component: InvoiceComponent },
//   { path: 'expenses', component: ExpensesComponent },
//   { path: 'payments', component: PaymentsComponent },
//   { path: 'orders', component: OrdersComponent },
//   { path: 'report', component: ReportComponent },
//   { path: 'notes', component: NotesComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];