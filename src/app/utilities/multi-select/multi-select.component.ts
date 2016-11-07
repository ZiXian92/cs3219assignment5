import { Component, Input, OnChanges } from '@angular/core';

import * as _ from 'lodash';

@Component({
  selector: 'multi-select',
  templateUrl: 'multi-select.component.html'
})

export class MultiSelectComponent implements OnChanges {
  constructor() {}

  @Input() itemList: any[];

  @Input() selectedItemList: any[];

  filterKey;
  selectList: any[] = [];
  displaySelectList: any[] = [];

  ngOnChanges(changes) :void {
    var newItemList = changes.itemList.currentValue;
    if(newItemList) {
      for(var i = 0; i < this.itemList.length; i++) {
        var item = this.itemList[i];
        this.selectList.push({
          name: item,
          value: item,
          selected: false
        });
      }
      this.displaySelectList = this.selectList;
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

  filter(filterKey) {
    if(filterKey) {
      filterKey = filterKey.toLowerCase();
      this.displaySelectList = _.filter(this.selectList, function(o :any) {
        return o.name.toLowerCase().indexOf(filterKey) >= 0 ? true : false
    });
    } else {
      this.displaySelectList = this.selectList;
    }
  }

}