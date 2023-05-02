import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { LatLng, LatLngExpression, LatLngTuple, LeafletMouseEvent, Map, Marker, icon, map, marker, tileLayer } from 'leaflet';
import { LocationService } from 'src/app/services/location.service';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnChanges {

  @Input() order!: Order;
  @Input() readOnly = false;
  @ViewChild('map', {static: true}) mapRef!: ElementRef;
  map!: Map;
  currentMarker!: Marker;

  private readonly MARKER_ZOOM_LEVEL = 16;
  private readonly MARKER_ICON = icon({
    iconUrl:
      'https://res.cloudinary.com/foodmine/image/upload/v1638842791/map/marker_kbua9q.png',
    iconSize: [42, 42],
    iconAnchor: [21, 42],
  });
  private readonly DEFAULT_LATLNG: LatLngTuple = [13.75, 21.62]

  constructor (private locationService: LocationService) {}

  ngOnChanges(): void {
    if (!this.order) return;
    this.initializeMap();

    if (this.readOnly && this.orderLatLng) {
      this.ShowReadOnlyMap();
    }
  }

  ShowReadOnlyMap() {
    const currentMap = this.map;
    this.setMarker(this.orderLatLng);
    currentMap.setView(this.orderLatLng, this.MARKER_ZOOM_LEVEL);
    currentMap.dragging.disable();
    currentMap.touchZoom.disable();
    currentMap.doubleClickZoom.disable();
    currentMap.scrollWheelZoom.disable();
    currentMap.boxZoom.disable();
    currentMap.keyboard.disable();
    currentMap.off('click');
    currentMap.tap?.disable();
    this.currentMarker.dragging?.disable();
  }

  initializeMap() {

    if (this.map) return;

    this.map = map(this.mapRef.nativeElement, {
      attributionControl: false
    }).setView(this.DEFAULT_LATLNG, 1);

    tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);

    this.map.on('click', (e:LeafletMouseEvent) => {
      this.setMarker(e.latlng);
    })

  }

  findMyLocation () {

    this.locationService.getCurrentLocation().subscribe({
      next: (latlng) => {
        this.map.setView(latlng, this.MARKER_ZOOM_LEVEL);
        this.setMarker(latlng);
      }
    });

  }

  setMarker (latlng: LatLngExpression) {

    this.orderLatLng = latlng as LatLng;

    if (this.currentMarker) {
      this.currentMarker.setLatLng(latlng);
      return;
    }

    this.currentMarker = marker(latlng, {
      draggable: true,
      icon: this.MARKER_ICON
    }).addTo(this.map);

    this.currentMarker.on('dragend', () => {
      this.orderLatLng = this.currentMarker.getLatLng();
    });
  }

  set orderLatLng (latlng: LatLng) {
    if (!latlng.lat.toFixed) return;

    latlng.lat = parseFloat(latlng.lat.toFixed(8));
    latlng.lng = parseFloat(latlng.lng.toFixed(8));
    this.order.addressLatLng = latlng;
  }

  get orderLatLng() {
    return this.order.addressLatLng!;
  }
}
