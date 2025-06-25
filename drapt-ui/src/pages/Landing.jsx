import { MainBlock } from '../components/baseui/MainBlock';
import { BeginText } from '../components/baseui/BeginText';
import { CardOne } from '../components/baseui/CustomCard';
import { ChartNoBorderCard } from '../components/analyseui/ChartCard';
import { dummyPerformance } from '../assets/dummy-data/chartData';
import CustomButton from '../components/baseui/CustomButton';
import CustomTable from '../components/baseui/CustomTable';
import { dummyPortfolioMetrics } from '../assets/dummy-data/tableData';
import { dummyNews } from '../assets/dummy-data/tableData';
import { CardHelper } from '../components/helperui/DivHelper';
import InnerEmptyState from '../components/errorui/InnerEmptyState';
import React, { useState, useEffect, useRef } from 'react';

export default function Landing() {

  const dummyPerformanceToRender = dummyPerformance;

  const [loading, setLoading ] = useState(false);
  const [loaded, setLoaded ] = useState(false);

  const metricsRef = useRef(null);
  const [metricsHeight, setMetricsHeight] = useState(0);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLoaded(true);
      if (metricsRef.current) {
        setMetricsHeight(metricsRef.current.clientHeight);
      }
    }, 1000);
  }, []);

  return (
    <MainBlock>
      <BeginText title={"Welcome back, Szymon"}>
        <p>Get a broad sense of how your portfolio is currently performing, and view any news you may have missed.</p>
      </BeginText>
      {loaded && (
        <>
          <div className='divider my-0'></div>
          {dummyPerformanceToRender.length == 0 ? (
            <CardOne id={"portfolioOverview"} title={"Portfolio Overview"}>
              <InnerEmptyState title='No portfolio created yet' message='Create a portfolio, or add holdings to see a performance overview'/>
            </CardOne>
          ) : (
            <CardOne id={"portfolioOverview"} title={"Portfolio Overview"}>
            <ChartNoBorderCard data={dummyPerformanceToRender} />
            <div className='flex md:flex-row justify-between gap-1 md:gap-3'>
              <CustomButton to="/analyse">Analyse</CustomButton>
              <CustomButton to="/portfolio">Portfolio</CustomButton>
            </div>
          </CardOne>
          )}
          <CardHelper>
            <CardOne title={"Aggregate Portfolio Metrics"}>
              <div ref={metricsRef}>
                <CustomTable data={dummyPortfolioMetrics} />
              </div>
            </CardOne>
            <CardOne title={"News Catchup"}>
              <CustomTable data={dummyNews} maxHeight={metricsHeight ? `${metricsHeight}px` : "389px"} /> {/* from undefined to a fixed height in px */}
            </CardOne>
          </CardHelper>
        </>
      )}

      {!loaded && loading && (
        <>
          <div className='divider my-0'></div>
          <div className='skeleton w-full h-[542px]'></div>
          <CardHelper>
            <div className='skeleton w-full h-[477px]'></div>
            <div className='skeleton w-full h-[477px]'></div>
          </CardHelper>
        </>
      )}
      
    </MainBlock>
  );
}