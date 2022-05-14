import React, { useEffect, useState, useRef } from 'react'
import { axiosClient } from '../axiosClient'
import TopBar from '../components/AdminTopBar'
import cookie from 'js-cookie'
import Router from 'next/router'
import 'ol/ol.css'
import Feature from 'ol/Feature'
import Map from 'ol/Map'
import Point from 'ol/geom/Point'
import View from 'ol/View'
import { fromLonLat } from 'ol/proj'
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style'
import { Cluster, OSM, Vector as VectorSource } from 'ol/source'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { boundingExtent } from 'ol/extent'

const visitMetrics = ({ visits }) => {
  const [map, setMap] = useState()
  const mapElement = useRef()
  const mapRef = useRef()
  mapRef.current = map

  const createMap = () => {
    const features = new Array(visits.length)
    for (let i = 0; i < visits.length; ++i) {
      const point = new Point(
        fromLonLat([visits[i].longitude, visits[i].latitude])
      )
      const _feature = new Feature({
        geometry: point,
        description: `(${visits[i].count}) ${
          visits[i].city
        }\n${visits[i].region}`
      })
      features[i] = _feature
    }

    const source = new VectorSource({
      features
    })

    const clusterSource = new Cluster({
      distance: 80,
      minDistance: 40,
      source
    })

    const styleCache = {}

    const clusters = new VectorLayer({
      source: clusterSource,
      style: function (feature) {
        const features = feature.get('features')
        const size = features.length
        let style = styleCache[size]
        if (size === 1) {
          style = new Style({
            text: new Text({
              text: features[0]?.values_?.description,
              font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
              placement: 'point',
              fill: new Fill({ color: '#fff' }),
              stroke: new Stroke({ color: '#000', width: 2 }),
              backgroundFill: new Fill({
                color: 'rgba(55, 55, 220, 0.8)'
              }),
              padding: [2, 2, 2, 2],
              offsetY: -5
            })
          })
        } else {
          if (!style) {
            style = new Style({
              image: new CircleStyle({
                radius: 10,
                stroke: new Stroke({
                  color: '#fff'
                }),
                fill: new Fill({
                  color: 'rgba(55, 55, 220, 0.8)'
                })
              }),
              text: new Text({
                text: size.toString(),
                fill: new Fill({
                  color: '#fff'
                })
              })
            })
            styleCache[size] = style
          }
        }
        return style
      }
    })

    const raster = new TileLayer({
      source: new OSM()
    })

    const _map = new Map({
      layers: [raster, clusters],
      target: 'map',
      view: new View({
        center: fromLonLat([-98.5795, 39.8283]),
        zoom: 5,
        maxZoom: 12
      })
    })

    _map.on('click', e => {
      clusters.getFeatures(e.pixel).then(clickedFeatures => {
        if (clickedFeatures.length) {
          // Get clustered Coordinates
          const features = clickedFeatures[0].get('features')
          if (features.length > 1) {
            const extent = boundingExtent(
              features.map(r => r.getGeometry().getCoordinates())
            )
            map
              .getView()
              .fit(extent, { duration: 1000, padding: [50, 50, 50, 50] })
          }
        }
      })
    })

    setMap(_map)
  }

  useEffect(() => {
    createMap()
  }, [])

  useEffect(() => {
    const token = cookie.get('token')
    if (token && token.length > 0) {
    } else {
      Router.push('/admin')
    }
  }, [])

  return (
    <div>
      <TopBar />
      <div className='p-flex-column' style={{ marginTop: 80 }}>
        <h3 style={{ marginLeft: 30 }}>Site Visits</h3>
        <div
          style={{ height: '80vh', width: '100%' }}
          id='map'
          className='map'
        />
      </div>
    </div>
  )
}

export async function getServerSideProps () {
  const visits = await axiosClient
    .get('/visitActionSummary')
    .then(response => response.data)

  return {
    props: {
      visits
    }
  }
}

export default visitMetrics
