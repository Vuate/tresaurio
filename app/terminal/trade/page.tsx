'use client';

import { useState } from 'react';
import AccountConnection from '@/components/terminal/trade/AccountConnection';
import ExcelUpload from '@/components/terminal/trade/ExcelUpload';
import APIGuide from '@/components/terminal/trade/APIGuide';
import APIModal from '@/components/terminal/trade/APIModal';
import APIGuideModal from '@/components/terminal/trade/APIGuideModal';
import PortfolioSummary from '@/components/terminal/trade/PortfolioSummary';
import LiveChart from '@/components/terminal/trade/LiveChart';
import SpotOrderPanel from '@/components/terminal/trade/SpotOrderPanel';
import FuturesOrderPanel from '@/components/terminal/trade/FuturesOrderPanel';
import RecentOrders from '@/components/terminal/trade/RecentOrders';
import SectionSeparator from '@/components/terminal/trade/SectionSeparator';
import SpotPositions from '@/components/terminal/trade/SpotPositions';
import ScenarioAnalysis from '@/components/terminal/trade/ScenarioAnalysis';
import FuturesPositions from '@/components/terminal/trade/FuturesPositions';
import RiskControl from '@/components/terminal/trade/RiskControl';
import OpenOrders from '@/components/terminal/trade/OpenOrders';
import AlertAutomation from '@/components/terminal/trade/AlertAutomation';
import PerformanceAnalysis from '@/components/terminal/trade/PerformanceAnalysis';
import SystemSecurity from '@/components/terminal/trade/SystemSecurity';
import Header from '@/components/terminal/trade/Header';

export default function TradePage() {
  const [isAPIModalOpen, setIsAPIModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="p-6 space-y-6">
        <AccountConnection onOpenAPIModal={() => setIsAPIModalOpen(true)} />
        <ExcelUpload />
        <APIGuide onOpenGuideModal={() => setIsGuideModalOpen(true)} />
        <PortfolioSummary />
        <LiveChart />
        
        {/* Emir Panelleri */}
        <div id="emir-panelleri" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpotOrderPanel />
          <FuturesOrderPanel />
        </div>
        
        <RecentOrders />
        
        <SectionSeparator icon="💎" title="SPOT POZİSYONLAR" variant="cyan" />
        <SpotPositions />
        <ScenarioAnalysis />
        
        <SectionSeparator icon="⚡" title="FUTURES POZİSYONLAR" variant="pink" />
        <FuturesPositions />
        <RiskControl />
        <OpenOrders />
        <AlertAutomation />
        <PerformanceAnalysis />
        <SystemSecurity />
      </div>

      <APIModal 
        isOpen={isAPIModalOpen} 
        onClose={() => setIsAPIModalOpen(false)} 
      />
      
<APIGuideModal 
  isOpen={isGuideModalOpen} 
  onClose={() => setIsGuideModalOpen(false)}
  onOpenAPIModal={() => setIsAPIModalOpen(true)}
/>
    </div>
  );
}