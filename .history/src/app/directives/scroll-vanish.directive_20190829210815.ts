import { Directive, Input, ElementRef, Renderer2, OnInit, Output, EventEmitter } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appScrollVanish]'
})
export class ScrollVanishDirective implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('appScrollVanish') scrollArea;
  @Output('visible') visible = new EventEmitter();

  private hidden = false;
  private triggerDistance = 25;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private domCtrl: DomController
  ) { }

  ngOnInit() {
    this.initStyles();

    this.scrollArea.ionScroll.subscribe(scrollEvent => {
      const delta = scrollEvent.detail.deltaY;

      if (scrollEvent.detail.currentY === 0 && this.hidden) {
        this.show();
      } else if (!this.hidden && delta > this.triggerDistance) {
        this.hide();
      }
    });
  }

  initStyles() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(
        this.element.nativeElement,
        'transition',
        '0.7s linear'
      );
      this.renderer.setStyle(this.element.nativeElement, 'height', '70px');
    });
  }

  hide() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, 'min-height', '0px');
      this.renderer.setStyle(this.element.nativeElement, 'height', '0px');
      this.renderer.setStyle(this.element.nativeElement, 'opacity', '0');
      this.renderer.setStyle(this.element.nativeElement, 'padding', '0');
    });
    this.visible.emit({data: false});
    this.hidden = true;
  }

  show() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, 'height', '70px');
      this.renderer.removeStyle(this.element.nativeElement, 'opacity');
      this.renderer.removeStyle(this.element.nativeElement, 'min-height');
      this.renderer.removeStyle(this.element.nativeElement, 'padding');
    });
    this.visible.emit({data: true});
    this.hidden = false;
  }

}
