import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  constructor() { }
  @Input() size: number = 50;
  @Input() colortype: string = 'primary';
  @Input() height100: boolean = true;
  public padding: any;
  ngOnInit() {

  }

}
