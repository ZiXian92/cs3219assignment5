import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'multi-select',
  templateUrl: 'multi-select.component.html'
})

export class MultiSelectComponent implements OnInit {
  constructor() {}

  @Input() itemList: any[];

  @Input() selectedItemList: any[];

  selectList: any[] = [];

  ngOnInit() :void {
    for(var i = 0; i < this.itemList.length; i++) {
      var item = this.itemList[i];
      this.selectList.push({
        name: item,
        value: item,
        selected: false
      });
    }
  }

  selectItem(select:any) {
    if(select.selected) {
      var index = this.selectedItemList.indexOf(select);
      this.selectedItemList.splice(index, 1);
    } else {
      this.selectedItemList.push(select);
    }
    select.selected = !select.selected;
  }
}