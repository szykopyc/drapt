import { Link } from 'react-router-dom';
import { MainBlock } from '../components/baseui/MainBlock';
import { BeginText } from '../components/baseui/BeginText';
import { CardOne } from '../components/baseui/CustomCard';
import { CardHelper } from '../components/helperui/DivHelper';
import { ChartNoBorderCard } from '../components/analyseui/ChartCard';
import { dummyPerformance } from '../assets/dummy-data/chartData';
import { CustomButton } from '../components/baseui/CustomButton';
import { CustomTable } from '../components/baseui/CustomTable';
import { dummyPortfolioMetrics } from '../assets/dummy-data/tableData';
import { dummyNews } from '../assets/dummy-data/tableData';
import React, { useState, useEffect, useRef } from 'react';

export default function Landing() {
  const metricsRef = useRef(null);
  const [metricsHeight, setMetricsHeight] = useState(0);

  useEffect(() => {
    if (metricsRef.current) {
      setMetricsHeight(metricsRef.current.clientHeight);
    }
  }, []);

  return (
    <MainBlock>
      <BeginText title={"Welcome back, Szymon"}>
        <p>Get a broad sense of how your portfolio is currently performing, and view any news you may have missed.</p>
      </BeginText>
      <div className='divider my-0'></div>
      <CardOne id={"portfolioOverview"} title={"Portfolio Overview"} flexSize={"1"}>
        <ChartNoBorderCard data={dummyPerformance} />
        <div className='flex md:flex-row justify-between gap-1 md:gap-3'>
          <CustomButton to="/analyse">Analyse</CustomButton>
          <CustomButton to="/portfolio">Portfolio</CustomButton>
        </div>
      </CardOne>
      <div className="flex flex-col md:flex-row gap-4 items-stretch w-full">
        <CardOne
          title={"Aggregate Portfolio Metrics"}
          flexSize={"1"}
        >
          <div ref={metricsRef}>
            <CustomTable data={dummyPortfolioMetrics} />
          </div>
        </CardOne>
        <CardOne
          title={"News Catchup"}
          flexSize={"1"}
        >
          <CustomTable data={dummyNews} maxHeight={metricsHeight ? `${metricsHeight}px` : undefined} />
        </CardOne>
      </div>
    </MainBlock>
  );
}