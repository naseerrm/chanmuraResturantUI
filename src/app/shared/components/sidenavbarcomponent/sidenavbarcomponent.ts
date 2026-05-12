import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarItem,SIDEBAR_ITEMS } from '../../../core/models/admin-sidebar-items';

@Component({
  selector: 'app-sidenavbarcomponent',
    standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidenavbarcomponent.html',
  styleUrl: './sidenavbarcomponent.scss',
})
export class Sidenavbarcomponent implements OnInit {
collapsed = true;
 sidebarItems: SidebarItem[] = [];
  toggle() {
    this.collapsed = !this.collapsed;
  }

   ngOnInit(): void {
    // Sort by order before displaying
    this.sidebarItems = SIDEBAR_ITEMS.sort((a, b) => (a.order || 0) - (b.order || 0));
  }
}
