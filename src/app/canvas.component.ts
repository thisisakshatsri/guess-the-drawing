import { Component, ElementRef, HostListener, Input, ViewChild, afterNextRender } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-canvas',
  standalone: true,
  template: `
    <mat-icon (click)="erase()" aria-hidden="false" aria-label="Erase" fontIcon="delete_outline"></mat-icon>
    <canvas [width]="width" [height]="height" #canvas></canvas> 
  `,
  imports: [MatIconModule],
  styles: `
  :host {
    position: relative;
    display: inline-block;
  }
  
  canvas {
    border: 1px solid #ddd; 
    border-radius: 8px; 
    cursor: crosshair; 
  }
  
  mat-icon {
    position: absolute;
    top: 10px; 
    left: 10px; 
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
    font-size: 24px; 
    color: #333; 
  }
  
  mat-icon:hover {
    opacity: 1;
  }
  canvas:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  `
})
export class CanvasComponent {
  @Input() width = 500;
  @Input() height = 500;

  @ViewChild('canvas') private canvas: ElementRef | null = null;

  private drawing = false;
  private pointBuffer: { x: number; y: number }[] = [];

  constructor() {
    afterNextRender(() => {
      this.erase();
    });
  }

  @HostListener('mousedown', ['$event'])
  private startDrawing() {
    this.drawing = true;
  }

  @HostListener('mousemove', ['$event'])
  private draw(event: MouseEvent) {
    if (!this.drawing) return;
    if (!this.canvas) return;

    const el = this.canvas.nativeElement as HTMLCanvasElement;
    const context = el.getContext('2d');

    if (!context) return;

    const rect = el.getBoundingClientRect();

    this.pointBuffer.push({
      x: event.x - rect.left,
      y: event.y - rect.top,
    });

    if (this.pointBuffer.length < 3) {
      return;
    }

    context.moveTo(this.pointBuffer[0].x, this.pointBuffer[0].y);

    context.bezierCurveTo(
      this.pointBuffer[0].x,
      this.pointBuffer[0].y,
      this.pointBuffer[1].x,
      this.pointBuffer[1].y,
      this.pointBuffer[2].x,
      this.pointBuffer[2].y
    );

    this.pointBuffer.shift();
    context.stroke();
  }

  @HostListener('document:mouseup')
  private stopDrawing() {
    this.drawing = false;
    this.pointBuffer = [];
  }

  getBase64Drawing() {
    if (!this.canvas) return null;
    return (this.canvas.nativeElement as HTMLCanvasElement).toDataURL().replace('data:image/png;base64,', '');
  }

  erase() {
    if (!this.canvas) return;
    const el = this.canvas.nativeElement as HTMLCanvasElement;
    const context = el.getContext('2d');

    if (!context) return;

    this.pointBuffer = [];

    context.reset();

    context.strokeStyle = '#000000';
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, this.width, this.height);
    context.fill();
  }
}
