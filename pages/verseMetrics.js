import React, { useEffect, useState, useRef } from 'react'
import { axiosClient } from '../axiosClient'
import { bibles } from '../bibles'
import { Chart } from 'primereact/chart'
import { interpolateColors } from '../components/Colors'
import { interpolateCool } from 'd3-scale-chromatic'
import TopBar from '../components/AdminTopBar'
import cookie from 'js-cookie'
import Router from 'next/router'

const verseMetrics = ({ versesRead, versesCopied }) => {
  useEffect(() => {
    const token = cookie.get('token')
    if (token && token.length > 0) {
    } else {
      Router.push('/admin')
    }
  }, [])

  const colorRangeInfo = {
    colorStart: 0,
    colorEnd: 0.65,
    useEndAsStart: true
  }

  const getChartData = data => {
    /* Create color array */
    const COLORS = interpolateColors(
      data?.length,
      interpolateCool,
      colorRangeInfo
    )

    const chartData = {
      labels: data?.map(d => d._id),
      datasets: [
        {
          label: 'Clicks Tracked',
          data: data.map(d => Number(d.count)),
          backgroundColor: COLORS,
          hoverBackgroundColor: COLORS
        }
      ]
    }

    return chartData
  }

  const getChartOptions = () => {
    const options = {
      responsive: true,
      legend: {
        display: false
      },
      plugins: {
        title: {
          display: false
        }
      },
      animation: {
        duration: 0
      },
      responsiveAnimationDuration: 0,
      hover: {
        animationDuration: 0,
        onHover: function (e) {
          var point = this.getElementAtEvent(e)
          e.target.style.cursor = point.length ? 'pointer' : 'default'
        }
      }
    }

    return options
  }

  return (
    <div>
      <TopBar />
      <div className='flex-column' style={{ marginTop: 80 }}>
        <h3 style={{ marginLeft: 30 }}>Verses Read</h3>
        <Chart
          animations={false}
          type='bar'
          data={getChartData(versesRead)}
          options={getChartOptions()}
          style={{
            position: 'relative',
            width: '100%'
          }}
        />
        <h3 style={{ marginLeft: 30 }}>Verses Copied</h3>
        <Chart
          animations={false}
          type='bar'
          data={getChartData(versesCopied)}
          options={getChartOptions()}
          style={{
            position: 'relative',
            width: '100%'
          }}
        />
      </div>
    </div>
  )
}

export async function getServerSideProps () {
  const versesRead = await axiosClient
    .get('/verseActionSummary/verse_read')
    .then(response => response.data)

  const versesCopied = await axiosClient
    .get('/verseActionSummary/verse_copied')
    .then(response => response.data)

  return {
    props: {
      versesRead,
      versesCopied
    }
  }
}

export default verseMetrics
