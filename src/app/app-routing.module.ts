import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteIndexComponent } from './route-index/route-index.component'

const routes: Routes = [
  { path: '', component: RouteIndexComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
