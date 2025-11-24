import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home, Settings, ClipboardList, AlertCircle, HelpCircle, 
  Power, ChevronRight, Activity, Map, ArrowLeft,
  LayoutGrid, Wrench, Save, Download, Phone, Mail, MapPin, Search, X,
  User, Database, PenTool, Layout, Globe, LogOut
} from 'lucide-react';
import { Gauge } from './components/Gauge';
import { AlarmModal } from './components/AlarmModal';
import { ViewState, Alarm, EquipmentData, SystemParameters, MaintenanceEntry } from './types';

// --- Constants & Assets ---
const IMG_SHIP_BANNER = "https://images.unsplash.com/photo-1551754659-02cb904b2bf5?auto=format&fit=crop&w=1000&q=80";

const DATE_OPTIONS: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

const TRANSLATIONS = {
  en: {
    systemTitle: 'Smart Monitoring System',
    monitorCenter: 'Smart Monitoring',
    equipmentMgmt: 'Equipment\nMgmt',
    onlineMonitor: 'Online\nMonitor',
    remoteControl: 'Remote\nControl',
    operatorAdmin: 'Operator Admin',
    signOut: 'Sign Out',
    reportCenter: 'Report Center',
    newAlerts: 'New',
    bannerDesc: 'Please check the device alarm records, maintenance cycle reports, and operation reports.',
    readReports: 'Read Reports',
    statAlarm: 'Alarm',
    statMaint: 'Equipment Maintenance',
    statTodo: 'To-Do Item',
    statService: 'To Be Serviced',
    statAnomaly: 'Equipment Anomaly',
    searchPlaceholder: 'Search for equipment, alarms or logs...',
    recentAlerts: 'Recent Alerts',
    viewHistory: 'View All History',
    // Dashboard
    oilTemp: 'Oil Temperature',
    windSpeed: 'Wind Speed',
    model: 'Model',
    liftingWeight: 'Lifting Weight',
    speed: 'Speed',
    mainAngle: 'Main Angle',
    ropeLength: 'Rope Length',
    workRadius: 'Work Radius',
    alarmActive: 'ALARM ACTIVE',
    // Remote
    clear: 'Clear',
    estop: 'E-STOP!',
    weight: 'WEIGHT',
    length: 'LENGTH',
    luffingDw: 'Luffing DW',
    luffingUp: 'Luffing UP',
    slewingCcw: 'Slewing\nCCW',
    slewingCw: 'Slewing\nCW',
    hoistingDw: 'Hoisting DW',
    hoistingUp: 'Hoisting UP',
    knuckleIn: 'Knuckle\nIN',
    knuckleOut: 'Knuckle\nOUT',
    top: 'TOP',
    side: 'SIDE',
    exit: 'Exit',
    // Params
    paramSelector: 'Parameter Setting Selector',
    back: 'Back',
    save: 'Save',
    liftingWeightSetting: 'Lifting Weight Setting',
    liftingWeightLimit: 'Lifting Weight Limit',
    warning90: 'Warning 90%',
    alarm110: 'Alarm 110%',
    workAngle: 'Work Angle',
    hoist: 'Hoist',
    slew: 'Slew',
    knuckle: 'Knuckle',
    luffing: 'Luffing',
    // Records
    maintenanceRecord: 'Maintenance Record',
    repairRecord: 'Repair Record',
    recordEntry: 'Record Entry',
    parts: 'Parts',
    itemProject: 'Item/Project',
    partName: 'Part Name',
    jobContent: 'Job Content',
    exportOrder: 'Export Maintenance Order',
    descriptionPlaceholder: 'Describe the work performed...',
    // Alarm History & Modal
    alarmWindow: 'Alarm window',
    noAlarms: 'No Historical Alarms',
    time: 'Time',
    date: 'Date',
    text: 'Text',
    ackGroup: 'Acknowledge group',
    alarmCode: 'Alarm Cod',
    warningCode: 'Warning Cod',
    alarmInfo: 'Alarm Information',
    warningInfo: 'Warning Information',
    acknowledge: 'ACKNOWLEDGE',
    // Help
    contactDetails: 'Contact Details',
    onSiteService: 'On-site Service',
    address: '10 Bukit Batok Crescent #05-05\nSingapore 658079',
    // Sidebar
    parameterSetting: 'Parameter Setting',
    help: 'Help',
    equipmentList: 'Equipment List',
    crane5T: '5T Knuckle Jib Crane',
    crane15T: '15T Telescopic Boom Crane',
    // Specific Alarm Messages
    alarms: {
        'MSTP 001': 'Emergency Stop Button of Main Pump Motor Control Cabinet Pressed, Reset After Fault Resolution.',
        'MSOL 002': 'Main Pump Motor Overload - Check if the Load Exceeds the Limit and Whether the Motor is Damaged.',
        'CESTP 003': 'Press the Emergency Stop Button on the Crane Control Cabinet',
        'OVLD 004': 'Lifting Weight to 110% Lifting Overload.',
        'ATB-3001': 'ATB (Anti-Over hoisting Switch) High Limit Triggered - Lower the Load to the Position Below ATB.',
        'MSOL-3002': 'Oil Temperature Too High.',
        'HPUL-3003': 'HPU LOW OIL LEVEL.',
        'HPULI-3004': 'HPU LOW OIL TEMPERATURE.',
        'HPUF-3005': 'HPU RETURN FILTER CLOGGED.',
        'MHLL-3006': 'MAIN HOIST LOW LIMIT.'
    }
  },
  zh: {
    systemTitle: '智能远程监控系统',
    monitorCenter: '智能监控中心',
    equipmentMgmt: '设备\n管理',
    onlineMonitor: '在线\n监控',
    remoteControl: '远程\n控制',
    operatorAdmin: '操作管理员',
    signOut: '登出',
    reportCenter: '报告中心',
    newAlerts: '新消息',
    bannerDesc: '请检查设备报警记录、维护周期报告和运维报告。',
    readReports: '阅读报告',
    statAlarm: '报警',
    statMaint: '设备保养',
    statTodo: '待办事项',
    statService: '待保养',
    statAnomaly: '设备异常',
    searchPlaceholder: '搜索设备、报警或日志...',
    recentAlerts: '最近报警',
    viewHistory: '查看所有历史',
    // Dashboard
    oilTemp: '油温',
    windSpeed: '风速',
    model: '型号',
    liftingWeight: '起重量',
    speed: '速度',
    mainAngle: '主臂角度',
    ropeLength: '绳长',
    workRadius: '工作半径',
    alarmActive: '报警激活',
    // Remote
    clear: '清除',
    estop: '急停!',
    weight: '重量',
    length: '长度',
    luffingDw: '变幅 下',
    luffingUp: '变幅 上',
    slewingCcw: '回转\n逆时针',
    slewingCw: '回转\n顺时针',
    hoistingDw: '起升 下',
    hoistingUp: '起升 上',
    knuckleIn: '折臂\n收',
    knuckleOut: '折臂\n伸',
    top: '顶部',
    side: '侧面',
    exit: '退出',
    // Params
    paramSelector: '参数设置选择',
    back: '返回',
    save: '保存',
    liftingWeightSetting: '起重量设置',
    liftingWeightLimit: '起重量限制',
    warning90: '预警 90%',
    alarm110: '报警 110%',
    workAngle: '工作角度',
    hoist: '起升',
    slew: '回转',
    knuckle: '折臂',
    luffing: '变幅',
    // Records
    maintenanceRecord: '保养记录',
    repairRecord: '维修记录',
    recordEntry: '记录录入',
    parts: '部位',
    itemProject: '项目',
    partName: '部件名称',
    jobContent: '作业内容',
    exportOrder: '导出保养单',
    descriptionPlaceholder: '描述执行的作业内容...',
    // Alarm History & Modal
    alarmWindow: '报警窗口',
    noAlarms: '无历史报警',
    time: '时间',
    date: '日期',
    text: '内容',
    ackGroup: '确认组',
    alarmCode: '报警代码',
    warningCode: '预警代码',
    alarmInfo: '报警信息',
    warningInfo: '预警信息',
    acknowledge: '确认收到',
    // Help
    contactDetails: '联系方式',
    onSiteService: '现场服务',
    address: '新加坡 武吉巴督新月10号 #05-05\n邮编 658079',
    // Sidebar
    parameterSetting: '参数设置',
    help: '帮助',
    equipmentList: '设备列表',
    crane5T: '5T 折臂吊',
    crane15T: '15T 伸缩臂吊',
    // Specific Alarm Messages
    alarms: {
        'MSTP 001': '主泵电机控制柜急停按钮被按下，故障排除后复位。',
        'MSOL 002': '主泵电机过载 - 检查负载是否超限以及电机是否损坏。',
        'CESTP 003': '按下起重机控制柜上的急停按钮。',
        'OVLD 004': '起重量达到110%，起重过载。',
        'ATB-3001': '防过卷开关(ATB)上限触发 - 将负载降低至ATB以下位置。',
        'MSOL-3002': '油温过高。',
        'HPUL-3003': '液压泵站(HPU)油位低。',
        'HPULI-3004': '液压泵站(HPU)油温低。',
        'HPUF-3005': '液压泵站(HPU)回油滤芯堵塞。',
        'MHLL-3006': '主起升下限位。'
    }
  }
};

const INITIAL_ALARMS: Alarm[] = [
  { code: 'MSTP 001', message: 'Emergency Stop Button of Main Pump Motor Control Cabinet Pressed, Reset After Fault Resolution.', type: 'ALARM', timestamp: '2025-11-12 08:00:00', active: true },
  { code: 'ATB-3001', message: 'ATB (Anti-Over hoisting Switch) High Limit Triggered - Lower the Load to the Position Below ATB.', type: 'WARNING', timestamp: '2025-11-12 09:30:00', active: true },
];

const INITIAL_RECORDS: MaintenanceEntry[] = [
    { id: '1', type: 'Maintenance', component: 'Crane Boom', date: '01/11/2025', time: '10:00', partName: 'Wire Rope', description: 'Regular greasing applied.', employee: 'John Doe' },
    { id: '2', type: 'Repair', component: 'Hydraulic Pump', date: '28/10/2025', time: '14:30', partName: 'Seal Kit', description: 'Replaced leaking seal on main pump.', employee: 'Jane Smith' }
];

// --- Visual Components ---

// 1. Redesigned Code-based Logo matching KTS brand
const KTSLogo = () => (
  <div className="flex flex-col select-none cursor-pointer hover:opacity-90 transition-opacity">
    <div className="flex items-center h-7 gap-1">
       {/* Orange Shape: Skewed Box */}
       <div className="h-full w-4 bg-[#e65100] transform -skew-x-[20deg] shadow-sm border border-[#bf360c]"></div>
       {/* Blue Shape: Skewed Box container for KTS */}
       <div className="h-full bg-[#003366] transform -skew-x-[20deg] px-3 flex items-center justify-center shadow-sm min-w-[60px] border border-[#001f3f]">
          <span className="text-white font-black italic text-lg transform skew-x-[20deg] leading-none pt-0.5 drop-shadow-md" style={{ fontFamily: 'Arial, sans-serif' }}>KTS</span>
       </div>
    </div>
    {/* Bottom Text */}
    <div className="text-[#003366] font-bold italic text-[10px] tracking-[0.4em] pl-5 leading-none mt-0.5 scale-x-110 origin-left" style={{ fontFamily: 'Arial, sans-serif' }}>
      ENERGY
    </div>
  </div>
);

// 2. Code-based Crane Visualization
const CraneVisual = ({ angle, ropeLength, activeAlarm }: { angle: number, ropeLength: number, activeAlarm: boolean }) => {
    // Simple trigonometry for visualization
    const rad = (angle * Math.PI) / 180;
    const armLength = 180;
    const startX = 40;
    const startY = 130;
    const endX = startX + armLength * Math.cos(rad);
    const endY = startY - armLength * Math.sin(rad);
    
    // Rope
    const ropeDrop = 20 + (ropeLength * 10); // Scaling rope length for visual

    return (
        <div className="w-full h-full bg-gradient-to-b from-sky-200 to-sky-100 relative overflow-hidden">
            {/* Sky/Cloud decoration */}
            <div className="absolute top-4 right-10 text-white/60"><Activity size={64}/></div>
            
            <svg width="100%" height="100%" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet">
                {/* Base */}
                <rect x="10" y="130" width="60" height="20" fill="#334155" />
                <circle cx="40" cy="130" r="15" fill="#1e293b" />
                
                {/* Main Boom */}
                <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
                <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#94a3b8" strokeWidth="2" />
                
                {/* Cylinder */}
                <line x1={startX + 30} y1={startY} x2={startX + 60 * Math.cos(rad)} y2={startY - 60 * Math.sin(rad)} stroke="#475569" strokeWidth="6" />

                {/* Rope */}
                <line x1={endX} y1={endY} x2={endX} y2={endY + ropeDrop} stroke="#000" strokeWidth="2" strokeDasharray="4 2" />
                
                {/* Hook/Load */}
                <rect x={endX - 10} y={endY + ropeDrop} width="20" height="20" fill={activeAlarm ? "#ef4444" : "#f59e0b"} stroke="#78350f" />
                
                {/* Angle Text */}
                <text x="150" y="20" fontSize="12" fill="#334155" fontWeight="bold">ANGLE: {angle.toFixed(1)}°</text>
            </svg>
            
            {/* Alert Overlay if active */}
            {activeAlarm && (
                <div className="absolute top-2 right-2 bg-red-600/90 text-white px-3 py-1 rounded text-xs font-bold animate-pulse flex items-center gap-1 shadow-lg">
                    <AlertCircle size={14} /> ALERT
                </div>
            )}
        </div>
    );
};

// 3. Code-based Map Visualization
const MapVisual = () => (
    <div className="w-full h-full bg-[#0f172a] relative overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
            {/* Fake Coastline */}
            <path d="M0,0 L400,0 L400,200 L0,200 Z" fill="#001e3c" />
            <path d="M0,50 Q50,40 100,80 T200,60 T300,100 T400,80 L400,200 L0,200 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
            
            {/* Grid Lines */}
            <line x1="100" y1="0" x2="100" y2="200" stroke="#1e293b" strokeDasharray="5 5" />
            <line x1="200" y1="0" x2="200" y2="200" stroke="#1e293b" strokeDasharray="5 5" />
            <line x1="300" y1="0" x2="300" y2="200" stroke="#1e293b" strokeDasharray="5 5" />
            <line x1="0" y1="100" x2="400" y2="100" stroke="#1e293b" strokeDasharray="5 5" />

            {/* Ship Route */}
            <path d="M50,150 Q150,120 250,140 T350,110" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 4" />
            
            {/* Ship Location */}
            <circle cx="250" cy="140" r="4" fill="#ef4444" className="animate-ping" />
            <circle cx="250" cy="140" r="3" fill="#fbbf24" />
        </svg>
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-1 text-[10px] text-green-400 border border-green-900 font-mono">
            LAT: 1.2834 N <br/> LON: 103.8607 E
        </div>
    </div>
);

// --- Sub-Components defined OUTSIDE App to prevent re-creation ---

const Header = ({ onNavigateHome, currentTime, language, setLanguage }: any) => {
    const [showLangMenu, setShowLangMenu] = useState(false);
    const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

    return (
    <header className="bg-[#001F3F] text-white h-16 flex items-center justify-between px-4 border-b-4 border-[#00A8E8] shadow-xl shrink-0 z-50">
      <div className="flex items-center gap-4">
        <button onClick={onNavigateHome} className="hover:bg-white/10 p-2 rounded transition-colors">
            <Home size={26} className="text-[#00A8E8]" />
        </button>
        {/* Logo Replacement: Code-based Component */}
        <KTSLogo />
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 bg-[#001F3F] px-8 py-1 rounded-b-xl border-b border-l border-r border-gray-700 shadow-lg">
         <span className="text-lg font-bold text-gray-200 tracking-wider">
             {t.systemTitle}
         </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm font-mono text-[#00A8E8] bg-black/30 px-3 py-1 rounded border border-gray-700 shadow-inner min-w-[160px] text-center">
            {currentTime}
        </div>
        <div className="relative">
            <button 
                className="flex items-center gap-2 hover:bg-white/10 px-2 py-1 rounded transition-colors"
                onClick={() => setShowLangMenu(!showLangMenu)}
            >
                <Globe size={16} className="text-gray-400"/>
                <div className="w-8 h-5 relative overflow-hidden border border-white shadow-sm">
                    {language === 'zh' ? (
                        <img src="https://flagcdn.com/w40/cn.png" className="w-full h-full object-cover" alt="CN"/>
                    ) : (
                        <img src="https://flagcdn.com/w40/gb.png" className="w-full h-full object-cover" alt="EN"/>
                    )}
                </div>
            </button>
            
            {showLangMenu && (
                <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <button onClick={() => { setLanguage('zh'); setShowLangMenu(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2 text-slate-800">
                        <img src="https://flagcdn.com/w20/cn.png" alt="CN"/> 中文
                    </button>
                    <button onClick={() => { setLanguage('en'); setShowLangMenu(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2 text-slate-800">
                        <img src="https://flagcdn.com/w20/gb.png" alt="EN"/> English
                    </button>
                </div>
            )}
        </div>
      </div>
    </header>
  );
};

const SideButton = ({ label, icon: Icon, onClick, active, colorClass = "from-[#002B55] to-slate-800" }: any) => (
    <button 
      onClick={onClick}
      className={`
        w-full h-14 mb-3 rounded-lg flex items-center px-3 gap-3 transition-all duration-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)] border border-slate-600
        bg-gradient-to-r hover:brightness-110 active:scale-95 group
        ${active 
          ? 'from-[#00A8E8] to-cyan-600 border-white text-white scale-105 shadow-[0_0_15px_rgba(0,168,232,0.4)]' 
          : `${colorClass} text-gray-300 hover:border-[#00A8E8] hover:text-white`
        }
      `}
    >
      <div className={`p-1.5 rounded-full ${active ? 'bg-white/20' : 'bg-black/30'} group-hover:bg-[#00A8E8]/20 transition-colors`}>
        <Icon size={18} />
      </div>
      <span className="font-bold text-xs uppercase tracking-tight text-left leading-none flex-1 whitespace-pre-line">
        {label}
      </span>
      {active && <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_5px_white]"></div>}
    </button>
);

const LandingView = ({ setCurrentView, alarmHistory, language, setLanguage }: any) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

    return (
    <div className="flex h-screen bg-gray-100 font-sans text-slate-800 overflow-hidden">
       {/* Mobile Sidebar */}
       <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-8 shadow-sm z-10 relative">
           {/* Logo Replacement */}
           <div className="scale-75 origin-center"><KTSLogo /></div>
           
           <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#00509E] transition-colors group">
             <div className="p-2 rounded-xl group-hover:bg-blue-50"><Settings size={24} /></div>
             <span className="text-[9px] font-bold text-center leading-3 whitespace-pre-line">{t.equipmentMgmt}</span>
           </button>
           
           <button 
             className="flex flex-col items-center gap-1 text-[#00509E] transition-colors group relative"
             onClick={() => setCurrentView(ViewState.DASHBOARD)}
            >
             <div className="p-2 rounded-xl bg-blue-50"><LayoutGrid size={24} /></div>
             <span className="text-[9px] font-bold text-center leading-3 whitespace-pre-line">{t.onlineMonitor}</span>
             <div className="absolute right-0 top-2 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
           </button>
           
           <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#00509E] transition-colors group" onClick={() => setCurrentView(ViewState.REMOTE_CONTROL)}>
             <div className="p-2 rounded-xl group-hover:bg-blue-50"><Power size={24} /></div>
             <span className="text-[9px] font-bold text-center leading-3 whitespace-pre-line">{t.remoteControl}</span>
           </button>

           <div className="mt-auto flex flex-col items-center gap-4 w-full relative">
             <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-300" onClick={() => setShowUserMenu(!showUserMenu)}>
                 <User size={16}/>
             </div>
             {showUserMenu && (
                 <div className="absolute left-16 bottom-0 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 z-50">
                     <div className="px-3 py-2 border-b border-gray-100 mb-1">
                         <div className="font-bold text-sm">{t.operatorAdmin}</div>
                         <div className="text-xs text-gray-400">ID: 8839201</div>
                     </div>
                     <button className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 rounded flex items-center gap-2">
                         <LogOut size={14}/> {t.signOut}
                     </button>
                 </div>
             )}
             <div className="h-px w-8 bg-gray-300"></div>
             <Home size={24} className="text-gray-800"/>
           </div>
       </div>

       {/* Content */}
       <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6">
          <div className="max-w-5xl mx-auto space-y-8">
              
              {/* Header */}
              <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <span className="bg-[#00509E] w-2 h-8 rounded-full"></span>
                      {t.monitorCenter}
                  </h1>
                  <div className="flex gap-2 relative">
                      <button onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')} className="hover:opacity-80 transition-opacity">
                        <img src={language === 'zh' ? "https://flagcdn.com/w40/cn.png" : "https://flagcdn.com/w40/gb.png"} className="h-6 rounded shadow" alt="Lang"/>
                      </button>
                  </div>
              </div>

              {/* Banner */}
              <div 
                className="relative h-64 rounded-3xl overflow-hidden shadow-2xl cursor-pointer group"
                onClick={() => setCurrentView(ViewState.DASHBOARD)}
              >
                  <img src={IMG_SHIP_BANNER} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="VALLIANZ HOPE"/>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00509E]/90 via-[#00509E]/40 to-transparent p-10 flex flex-col justify-center text-white">
                      <div className="bg-white/20 backdrop-blur w-fit px-4 py-1 rounded-full text-xs font-bold uppercase mb-4 border border-white/30">VALLIANZ HOPE</div>
                      <h2 className="text-4xl font-bold mb-4 flex items-center gap-3">
                          {t.reportCenter} <div className="bg-red-500 text-xs px-2 py-1 rounded-full animate-pulse">8 {t.newAlerts}</div>
                      </h2>
                      <p className="max-w-lg text-lg opacity-90 mb-8 font-light">
                          {t.bannerDesc}
                      </p>
                      <button className="bg-[#F59E0B] text-black px-8 py-3 rounded-xl font-bold w-max hover:bg-[#D97706] transition-colors shadow-lg flex items-center gap-2">
                          {t.readReports} <ChevronRight size={18}/>
                      </button>
                  </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-5 gap-6">
                  {[
                      { val: 5, label: t.statAlarm, color: "bg-orange-500", text: "text-white", view: ViewState.ALARM_HISTORY },
                      { val: 2, label: t.statMaint, color: "bg-yellow-400", text: "text-slate-900", view: ViewState.MAINTENANCE_RECORD },
                      { val: 3, label: t.statTodo, color: "bg-emerald-500", text: "text-white", view: null },
                      { val: 1, label: t.statService, color: "bg-yellow-200", text: "text-yellow-800", view: ViewState.MAINTENANCE_RECORD },
                      { val: 0, label: t.statAnomaly, color: "bg-yellow-100", text: "text-yellow-600", view: ViewState.REPAIR_RECORD },
                  ].map((stat, idx) => (
                      <div 
                        key={idx} 
                        className={`${stat.color} ${stat.text} rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg transform hover:-translate-y-1 transition-transform cursor-pointer hover:shadow-xl active:scale-95`}
                        onClick={() => stat.view ? setCurrentView(stat.view) : alert("No items in this category.")}
                      >
                          <span className="text-5xl font-black mb-2">{stat.val}</span>
                          <span className="text-xs font-bold uppercase text-center leading-tight tracking-wide">{stat.label}</span>
                      </div>
                  ))}
              </div>

              {/* Search & List */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="relative mb-6">
                      <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                      <input type="text" placeholder={t.searchPlaceholder} className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#00509E] transition-all" />
                      <button className="absolute right-3 top-2.5 p-1 text-gray-400 hover:text-gray-800"><LayoutGrid size={20}/></button>
                  </div>

                  <div className="space-y-4">
                      <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-4">{t.recentAlerts}</h3>
                      {alarmHistory.slice(0, 3).map((alarm: Alarm, idx: number) => {
                          // Lookup translated message
                          const msg = t.alarms[alarm.code as keyof typeof t.alarms] || alarm.message;
                          return (
                          <div 
                             key={idx} 
                             onClick={() => setCurrentView(ViewState.ALARM_HISTORY)}
                             className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                              <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                                      <AlertCircle size={20} />
                                  </div>
                                  <div>
                                      <div className="font-bold text-slate-700 group-hover:text-red-700">{alarm.code}</div>
                                      <div className="text-xs text-gray-400">{alarm.timestamp}</div>
                                  </div>
                              </div>
                              <div className="text-sm font-medium text-gray-600 max-w-md truncate">{msg}</div>
                              <ChevronRight size={18} className="text-gray-300 group-hover:text-red-400" />
                          </div>
                      )})}
                      
                      <button 
                        className="w-full py-3 text-center text-sm font-bold text-[#00509E] hover:bg-blue-50 rounded-xl transition-colors"
                        onClick={() => setCurrentView(ViewState.ALARM_HISTORY)}
                      >
                          {t.viewHistory}
                      </button>
                  </div>
              </div>

          </div>
       </div>
    </div>
  );
}

const DashboardView = ({ data, activeAlarm, setActiveAlarm, language }: any) => {
    const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
    return (
    <div className="grid grid-cols-12 gap-1 h-full bg-[#001F3F] p-2">
      {/* Left Panel: Stats */}
      <div className="col-span-3 bg-[#002B55]/80 border border-slate-600 rounded-lg p-2 flex flex-col gap-2 shadow-inner">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#0f172a] rounded p-2 border border-slate-700 shadow-lg relative">
             <div className="absolute top-1 left-2 text-[10px] text-gray-400 font-bold uppercase">{t.oilTemp}</div>
             <Gauge value={data.oilTemp} min={0} max={120} label="TEMP" unit="°C" color={data.oilTemp > 90 ? "#ef4444" : "#00A8E8"} />
          </div>
          <div className="bg-[#0f172a] rounded p-2 border border-slate-700 shadow-lg relative">
             <div className="absolute top-1 left-2 text-[10px] text-gray-400 font-bold uppercase">{t.windSpeed}</div>
             <Gauge value={data.windSpeed} min={0} max={40} label="SPEED" unit="m/s" color={data.windSpeed > 20 ? "#eab308" : "#22c55e"} />
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 bg-[#0f172a] rounded border border-slate-700 p-1 overflow-auto">
           <table className="w-full text-xs text-left border-collapse">
             <tbody>
               {[
                 [t.model, data.model === '5T MODEL' ? t.crane5T : t.crane15T],
                 [t.liftingWeight, `${data.liftingWeight.toFixed(2)} T`],
                 [t.speed, `${data.speed.toFixed(1)} M/S`],
                 [t.mainAngle, `${data.mainAngle.toFixed(1)} °`],
                 [t.ropeLength, `${data.ropeLength.toFixed(1)} M`],
                 [t.workRadius, `${data.workRadius.toFixed(1)} M`]
               ].map(([label, val], idx) => (
                 <tr key={idx} className="border-b border-slate-800 hover:bg-white/5 transition-colors">
                   <td className="py-3 px-3 text-gray-400 font-medium">{label}</td>
                   <td className="py-3 px-3 text-right font-bold text-white bg-white/5 rounded-l">{val}</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </div>

      {/* Center Panel: Visualization */}
      <div className="col-span-9 flex flex-col gap-2">
          {/* Top: Crane Visual */}
          <div className="flex-1 bg-black rounded-lg border border-slate-600 relative overflow-hidden group">
            {/* Dynamic Code-based Crane Visual */}
            <CraneVisual angle={data.mainAngle} ropeLength={data.ropeLength} activeAlarm={!!activeAlarm} />
          </div>
          
          {/* Bottom: Map Visual */}
          <div className="h-1/3 bg-black rounded-lg border border-slate-600 relative overflow-hidden">
             {/* Dynamic Code-based Map Visual */}
             <MapVisual />
          </div>
      </div>
    </div>
    )
};

const RemoteControlView = ({ data, params, activeAlarm, handleControl, setCurrentView, language }: any) => {
    const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
    const alarmMsg = activeAlarm ? (t.alarms[activeAlarm.code as keyof typeof t.alarms] || activeAlarm.message) : "";

    return (
    <div className="h-full flex flex-col bg-gray-300 p-4 rounded relative overflow-hidden">
        {/* Header Strip */}
        <div className="bg-white p-2 flex justify-between items-center border-b border-gray-400 mb-4 rounded shadow-sm">
            <div className="flex items-center gap-4">
               <div className="flex items-center">
                    {/* Logo Replacement */}
                    <KTSLogo />
               </div>
               <div className="h-6 w-px bg-gray-300"></div>
               <div className="font-mono font-bold text-lg">{new Date().toLocaleString()}</div>
            </div>
            <button className="bg-gray-700 text-white px-3 py-1 text-xs rounded uppercase font-bold hover:bg-gray-800">{t.clear}</button>
        </div>

        {/* Dashboard Readout */}
        <div className="bg-gradient-to-b from-gray-200 to-gray-300 border border-gray-400 p-4 rounded-lg mb-4 flex justify-between items-center shadow-inner">
            <div className="bg-yellow-400 border-4 border-yellow-500 p-2 rounded w-40 text-center shadow">
                 <div className="text-xs font-bold uppercase mb-1">SWL {params.liftingWeightLimit}T 12M</div>
                 <div className="font-black text-xl text-red-600 animate-pulse">{t.estop}</div>
            </div>
            
            {/* Visual of Crane */}
            <div className="flex-1 h-32 relative mx-4 bg-white/50 rounded border border-gray-300 flex items-center justify-center overflow-hidden">
                {/* Shared SVG Crane Visual */}
                <CraneVisual angle={data.mainAngle} ropeLength={data.ropeLength} activeAlarm={!!activeAlarm} />

                {/* Warning Banner Text Overlay if needed specific for remote view */}
                {activeAlarm && (
                    <div className="absolute inset-x-10 top-2 bg-red-600 text-white text-center p-1 text-xs font-bold animate-pulse shadow-lg border-2 border-yellow-400 z-10">
                        {alarmMsg}
                    </div>
                )}
            </div>

            <div className="bg-gray-100 p-2 rounded border border-gray-300 w-32">
                <div className="flex justify-between text-xs mb-1"><span>{t.weight}:</span> <b>{data.liftingWeight.toFixed(2)} T</b></div>
                <div className="flex justify-between text-xs mb-1"><span>{t.length}:</span> <b>{data.ropeLength.toFixed(1)} M</b></div>
                <div className="flex justify-between text-xs"><span>{t.speed}:</span> <b>0.0 M/min</b></div>
            </div>
        </div>

        {/* Controller Interface */}
        <div className="flex-1 bg-[#4b5563] rounded-xl p-8 flex items-center justify-center relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
            <div className="w-full max-w-4xl grid grid-cols-3 gap-12">
                
                {/* Left Joystick */}
                <div className="flex flex-col items-center">
                    <div className="relative w-48 h-48 bg-[#1f2937] rounded-full border-4 border-gray-600 shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center">
                        <span className="absolute top-4 text-[10px] text-gray-400 font-bold uppercase">{t.luffingDw}</span>
                        <span className="absolute bottom-4 text-[10px] text-gray-400 font-bold uppercase">{t.luffingUp}</span>
                        <span className="absolute left-2 text-[10px] text-gray-400 font-bold uppercase w-12 text-center leading-3 whitespace-pre-line">{t.slewingCcw}</span>
                        <span className="absolute right-2 text-[10px] text-gray-400 font-bold uppercase w-12 text-center leading-3 whitespace-pre-line">{t.slewingCw}</span>

                        <div className="w-24 h-24 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full shadow-[0_5px_10px_rgba(0,0,0,0.5),inset_0_2px_5px_rgba(255,255,255,0.2)] flex items-center justify-center relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-tr from-red-900 to-red-600 rounded-full border-2 border-red-400 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"></div>
                        </div>

                        {/* Interactive Zones */}
                        <button className="absolute top-0 w-full h-1/3 z-20 active:bg-white/10 rounded-t-full" onMouseDown={() => handleControl('LUFF_DOWN')} />
                        <button className="absolute bottom-0 w-full h-1/3 z-20 active:bg-white/10 rounded-b-full" onMouseDown={() => handleControl('LUFF_UP')} />
                    </div>
                </div>

                {/* Center Panel */}
                <div className="flex flex-col items-center justify-center gap-6">
                    <div className="flex gap-4 mb-4">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-12 h-12 rounded-full bg-gray-700 border-2 border-gray-500 shadow flex items-center justify-center">
                                <div className="w-1 h-6 bg-white rounded transform rotate-45"></div>
                            </div>
                        ))}
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-400 rounded flex items-center justify-center shadow-lg border border-gray-500">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-white rounded-full border border-gray-300 shadow-inner"></div>
                    </div>
                    <div className="flex gap-2 w-full mt-4">
                         <button className="flex-1 bg-cyan-600 text-white text-xs font-bold py-2 rounded border-b-4 border-cyan-800 active:border-0 active:mt-1">{t.top}</button>
                         <button className="flex-1 bg-cyan-600 text-white text-xs font-bold py-2 rounded border-b-4 border-cyan-800 active:border-0 active:mt-1">{t.side}</button>
                         <button className="flex-1 bg-cyan-600 text-white text-xs font-bold py-2 rounded border-b-4 border-cyan-800 active:border-0 active:mt-1" onClick={() => setCurrentView(ViewState.DASHBOARD)}>{t.exit}</button>
                    </div>
                </div>

                {/* Right Joystick */}
                <div className="flex flex-col items-center">
                    <div className="relative w-48 h-48 bg-[#1f2937] rounded-full border-4 border-gray-600 shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center">
                        <span className="absolute top-4 text-[10px] text-gray-400 font-bold uppercase">{t.hoistingDw}</span>
                        <span className="absolute bottom-4 text-[10px] text-gray-400 font-bold uppercase">{t.hoistingUp}</span>
                        <span className="absolute left-2 text-[10px] text-gray-400 font-bold uppercase w-12 text-center leading-3 whitespace-pre-line">{t.knuckleIn}</span>
                        <span className="absolute right-2 text-[10px] text-gray-400 font-bold uppercase w-12 text-center leading-3 whitespace-pre-line">{t.knuckleOut}</span>

                         <div className="w-24 h-24 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full shadow-[0_5px_10px_rgba(0,0,0,0.5),inset_0_2px_5px_rgba(255,255,255,0.2)] flex items-center justify-center relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-tr from-red-900 to-red-600 rounded-full border-2 border-red-400 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"></div>
                        </div>

                        {/* Interactive Zones */}
                         <button className="absolute top-0 w-full h-1/3 z-20 active:bg-white/10 rounded-t-full" onMouseDown={() => handleControl('HOIST_DOWN')} />
                        <button className="absolute bottom-0 w-full h-1/3 z-20 active:bg-white/10 rounded-b-full" onMouseDown={() => handleControl('HOIST_UP')} />
                    </div>
                </div>

            </div>
        </div>
    </div>
    )
};

const ParameterView = ({ data, params, saveParameter, setCurrentView, language }: any) => {
    const [subView, setSubView] = useState<'menu' | 'lifting'>('menu');
    const [localParams, setLocalParams] = useState(params);
    const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

    if (subView === 'lifting') {
        return (
            <div className="flex flex-col h-full bg-[#2a2a2a] p-10 items-center animate-in fade-in">
                 <div className="w-full max-w-3xl bg-[#333] border border-gray-600 rounded-lg overflow-hidden shadow-2xl">
                     <div className="bg-[#87CEEB] p-4 text-center border-b border-gray-500">
                         <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wider">{t.liftingWeightSetting}</h2>
                     </div>
                     
                     <div className="p-12 space-y-8 bg-[#333]">
                          <div className="flex items-center justify-center gap-6">
                              <label className="text-white font-bold w-48 text-right">{t.liftingWeight}:</label>
                              <div className="bg-white text-black font-bold px-4 py-2 w-32 text-center border-2 border-gray-400">{data.liftingWeight.toFixed(1)} T</div>
                          </div>

                          <div className="h-px bg-gray-600 w-3/4 mx-auto"></div>

                          <div className="flex items-center justify-center gap-6">
                              <label className="text-white font-bold w-48 text-right">{t.liftingWeightLimit}:</label>
                              <input 
                                type="number" 
                                className="bg-yellow-400 text-black font-bold px-4 py-2 w-32 text-center border-2 border-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={localParams.liftingWeightLimit}
                                onChange={(e) => setLocalParams({...localParams, liftingWeightLimit: parseFloat(e.target.value)})}
                              />
                              <span className="text-gray-400 font-bold">T</span>
                          </div>

                          <div className="flex items-center justify-center gap-6">
                              <label className="text-white font-bold w-48 text-right">{t.warning90}:</label>
                              <input 
                                type="number" 
                                className="bg-yellow-400 text-black font-bold px-4 py-2 w-32 text-center border-2 border-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={localParams.warning90}
                                onChange={(e) => setLocalParams({...localParams, warning90: parseFloat(e.target.value)})}
                              />
                              <span className="text-gray-400 font-bold">T</span>
                          </div>

                          <div className="flex items-center justify-center gap-6">
                              <label className="text-white font-bold w-48 text-right">{t.alarm110}:</label>
                              <input 
                                type="number" 
                                className="bg-red-600 text-white font-bold px-4 py-2 w-32 text-center border-2 border-red-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={localParams.alarm110}
                                onChange={(e) => setLocalParams({...localParams, alarm110: parseFloat(e.target.value)})}
                              />
                              <span className="text-gray-400 font-bold">T</span>
                          </div>
                     </div>

                     <div className="bg-[#444] p-4 flex justify-end gap-4 border-t border-gray-600">
                         <button onClick={() => saveParameter(localParams)} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-bold shadow flex items-center gap-2">
                             <Save size={18} /> {t.save}
                         </button>
                         <button onClick={() => setSubView('menu')} className="bg-[#87CEEB] hover:bg-sky-300 text-slate-800 px-6 py-2 rounded font-bold shadow">
                             {t.back}
                         </button>
                     </div>
                 </div>
            </div>
        )
    }

    return (
      <div className="h-full flex flex-col p-10 items-center justify-center bg-[#f0f9ff]">
         <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-blue-200 overflow-hidden">
             <div className="bg-[#87CEEB] p-4 text-center border-b border-blue-300">
                <h3 className="text-xl text-slate-800 font-bold uppercase tracking-wider">{t.paramSelector}</h3>
             </div>
             <div className="p-10 grid grid-cols-2 gap-8">
                {[t.liftingWeight, t.speed, t.workAngle, t.statAlarm, t.hoist, t.knuckle, t.slew, t.luffing].map((item, idx) => (
                    <button 
                        key={idx}
                        onClick={() => idx === 0 ? setSubView('lifting') : null}
                        className={`
                            h-16 rounded-lg shadow-md border font-bold text-white uppercase tracking-widest transition-transform active:scale-95
                            ${idx === 0 ? 'bg-[#87CEEB] border-blue-400 hover:bg-blue-300 text-slate-900 ring-4 ring-blue-100' : 'bg-[#87CEEB] opacity-60 cursor-not-allowed border-gray-300 text-slate-700'}
                        `}
                    >
                        {item}
                    </button>
                ))}
            </div>
            <div className="p-4 bg-gray-50 text-right">
                <button onClick={() => setCurrentView(ViewState.DASHBOARD)} className="bg-[#87CEEB] px-8 py-2 rounded shadow font-bold text-slate-800 hover:bg-blue-300">{t.back}</button>
            </div>
         </div>
      </div>
    );
};

const RecordView = ({ type, setCurrentView, saveRecord, language }: any) => {
     // Form State
     const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
     const [form, setForm] = useState<MaintenanceEntry>({
         id: Date.now().toString(),
         type,
         component: 'Crane Boom',
         date: new Date().toLocaleDateString('en-GB'),
         time: new Date().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'}),
         partName: '',
         description: '',
         employee: 'Operator'
     });

     const typeLabel = type === 'Maintenance' ? t.maintenanceRecord : t.repairRecord;

     return (
         <div className="h-full flex items-center justify-center bg-[#2d3748]">
             <div className="w-full max-w-4xl bg-[#4a5568] border-2 border-gray-600 rounded shadow-2xl overflow-hidden flex flex-col">
                 <div className="bg-[#87CEEB] p-3 text-center border-b border-gray-500 flex justify-between items-center px-6">
                     <span className="font-bold text-slate-800 uppercase text-lg">{t.recordEntry} - {typeLabel}</span>
                     <div className="flex gap-2 text-xs">
                         <span className="font-mono text-slate-800">DATA: {form.date}</span>
                         <span className="font-mono text-slate-800">TIME: {form.time}</span>
                     </div>
                 </div>

                 <div className="p-8 space-y-6">
                     {/* Row 1 */}
                     <div className="flex items-center gap-4">
                         <label className="w-32 text-right text-gray-300 font-bold uppercase text-xs">{t.parts}</label>
                         <div className="flex-1 bg-white p-2 rounded flex items-center justify-between border border-gray-400">
                             <span className="font-bold text-gray-800">{form.component}</span>
                             <div className="bg-[#F59E0B] p-1 rounded text-white"><LayoutGrid size={16}/></div>
                         </div>
                     </div>
                     
                     {/* Row 2 */}
                     <div className="flex items-center gap-4">
                         <label className="w-32 text-right text-gray-300 font-bold uppercase text-xs">{t.itemProject}</label>
                         <input 
                            className="flex-1 bg-white p-2 rounded border border-gray-400 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="e.g., Wire Rope Greasing"
                            value={form.partName}
                            onChange={(e) => setForm({...form, partName: e.target.value})}
                         />
                         <div className="text-[#F59E0B]"><PenTool size={24}/></div>
                     </div>

                     {/* Details Row */}
                     <div className="flex gap-4 pl-36">
                         <div className="bg-white rounded p-2 border border-gray-400 flex-1">
                             <span className="text-[10px] text-gray-500 uppercase font-bold block">{t.partName}</span>
                             <input className="w-full font-bold text-sm outline-none" />
                         </div>
                         <div className="bg-white rounded p-2 border border-gray-400 flex-1">
                             <span className="text-[10px] text-gray-500 uppercase font-bold block">{t.model}</span>
                             <input className="w-full font-bold text-sm outline-none" />
                         </div>
                     </div>

                     {/* Content Area */}
                     <div className="flex items-start gap-4 h-32">
                         <label className="w-32 text-right text-gray-300 font-bold uppercase text-xs mt-2">{t.jobContent}</label>
                         <textarea 
                            className="flex-1 h-full bg-white p-4 rounded border border-gray-400 resize-none font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder={t.descriptionPlaceholder}
                            value={form.description}
                            onChange={(e) => setForm({...form, description: e.target.value})}
                         ></textarea>
                     </div>
                 </div>

                 {/* Footer Actions */}
                 <div className="bg-[#2d3748] p-4 flex justify-between items-center border-t border-gray-600">
                     <div className="bg-white rounded-full px-4 py-1 flex items-center gap-2 border border-gray-400">
                         <Search size={16} className="text-gray-500"/>
                         <input className="bg-transparent outline-none text-sm w-32" placeholder="Search" />
                     </div>
                     
                     <div className="flex gap-4">
                         <button className="bg-[#87CEEB] hover:bg-blue-300 text-slate-800 px-4 py-2 rounded font-bold text-xs shadow">{t.exportOrder}</button>
                         <button 
                            onClick={() => saveRecord(form)}
                            className="bg-[#00A8E8] hover:bg-cyan-500 text-white px-8 py-2 rounded font-bold shadow-lg border border-cyan-300 transform active:scale-95 transition-transform"
                        >
                             {t.save}
                         </button>
                         <button 
                            onClick={() => setCurrentView(ViewState.DASHBOARD)}
                            className="bg-[#87CEEB] hover:bg-blue-300 text-slate-800 px-6 py-2 rounded font-bold shadow"
                        >
                             {t.exit}
                         </button>
                     </div>
                 </div>
             </div>
         </div>
     )
};

const AlarmHistoryView = ({ alarmHistory, setCurrentView, language }: any) => {
    const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
    return (
    <div className="bg-gray-200 h-full rounded flex flex-col text-gray-800 font-sans border-4 border-gray-400">
          <div className="bg-gray-300 p-2 border-b border-gray-400 flex justify-between items-center px-4 select-none">
              <span className="font-bold text-gray-700">{t.alarmWindow}</span>
              <X className="text-gray-500 cursor-pointer hover:text-red-600" onClick={() => setCurrentView(ViewState.DASHBOARD)}/>
          </div>
          <div className="flex-1 overflow-auto bg-white p-1">
              <table className="w-full text-xs border-collapse">
                  <thead>
                      <tr className="bg-gray-100 text-left border-b border-gray-300">
                          <th className="p-2 border-r border-gray-300 font-bold text-gray-600">No.</th>
                          <th className="p-2 border-r border-gray-300 font-bold text-gray-600">{t.time}</th>
                          <th className="p-2 border-r border-gray-300 font-bold text-gray-600">{t.date}</th>
                          <th className="p-2 border-r border-gray-300 font-bold text-gray-600">St...</th>
                          <th className="p-2 border-r border-gray-300 font-bold text-gray-600">{t.text}</th>
                          <th className="p-2 font-bold text-gray-600">{t.ackGroup}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {alarmHistory.map((alarm: Alarm, i: number) => (
                          <tr key={i} className="border-b border-gray-200 hover:bg-blue-50 cursor-pointer">
                              <td className="p-2 border-r border-gray-200 bg-gray-50 font-mono">{i+1}</td>
                              <td className="p-2 border-r border-gray-200 font-mono">{alarm.timestamp.split(' ')[1]}</td>
                              <td className="p-2 border-r border-gray-200 font-mono">{alarm.timestamp.split(' ')[0]}</td>
                              <td className="p-2 border-r border-gray-200 text-center font-bold text-red-500">I</td>
                              <td className="p-2 border-r border-gray-200 font-medium text-gray-800 uppercase">
                                  {(t.alarms[alarm.code as keyof typeof t.alarms] || alarm.message).substring(0, 50)}...
                              </td>
                              <td className="p-2 text-gray-500">0</td>
                          </tr>
                      ))}
                      {alarmHistory.length === 0 && (
                          <tr><td colSpan={6} className="p-8 text-center text-gray-400">{t.noAlarms}</td></tr>
                      )}
                  </tbody>
              </table>
          </div>
          <div className="bg-gray-200 p-2 flex justify-between border-t border-gray-300">
              <button className="p-2 bg-gray-100 border border-gray-400 rounded shadow hover:bg-white"><ClipboardList size={20}/></button>
              <button className="p-2 bg-gray-100 border border-gray-400 rounded shadow hover:bg-white"><Download size={20}/></button>
          </div>
      </div>
    )
};

const HelpView = ({ setCurrentView, language }: any) => {
    const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#333] text-white relative">
          <div className="bg-[#87CEEB] w-full py-4 text-center absolute top-20 border-y-4 border-blue-400">
               <h2 className="text-2xl font-black text-yellow-300 uppercase tracking-[0.2em] drop-shadow-md">{t.contactDetails}</h2>
          </div>
          
          <div className="bg-[#444] p-10 rounded-xl shadow-2xl border border-gray-500 w-full max-w-lg space-y-8 mt-20">
              <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-[#333] rounded-lg border border-gray-500 flex items-center justify-center shadow-inner">
                      <Phone className="text-white" size={32} />
                  </div>
                  <div>
                      <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">TEL:</div>
                      <div className="bg-white text-black font-bold px-4 py-2 rounded w-64 text-lg font-mono">+65 6565 6868</div>
                  </div>
              </div>
              
              <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-[#333] rounded-lg border border-gray-500 flex items-center justify-center shadow-inner">
                      <Mail className="text-white" size={32} />
                  </div>
                  <div>
                      <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Email:</div>
                      <div className="bg-white text-black font-bold px-4 py-2 rounded w-64 text-sm">aftersales@ktsenergy.com</div>
                  </div>
              </div>

               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-[#333] rounded-lg border border-gray-500 flex items-center justify-center shadow-inner">
                      <MapPin className="text-white" size={32} />
                  </div>
                  <div>
                      <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Address:</div>
                      <div className="bg-white text-black font-bold px-4 py-2 rounded w-64 text-xs leading-tight whitespace-pre-line">
                          {t.address}
                      </div>
                  </div>
              </div>

              <div className="flex justify-center mt-8">
                <button className="bg-[#87CEEB] hover:bg-blue-300 text-slate-800 font-bold py-3 px-10 rounded shadow-lg uppercase tracking-wider flex items-center gap-2">
                    <Wrench size={20}/> {t.onSiteService}
                </button>
              </div>
          </div>
          
          <button 
            onClick={() => setCurrentView(ViewState.DASHBOARD)} 
            className="mt-12 bg-[#87CEEB] hover:bg-blue-300 text-slate-800 px-8 py-2 rounded font-bold"
          >
               {t.exit}
          </button>
      </div>
    )
};

const SystemLayout = ({ children, title, currentView, setCurrentView, currentTime, data, setData, language, setLanguage }: any) => {
    const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
    return (
    <div className="flex flex-col h-screen bg-gray-900 overflow-hidden font-sans select-none">
      <Header onNavigateHome={() => setCurrentView(ViewState.LANDING)} currentTime={currentTime} language={language} setLanguage={setLanguage} />
      
      <div className="flex flex-1 overflow-hidden relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        
        {/* Main Content Area */}
        <main className="flex-1 p-2 mr-[200px] relative flex flex-col h-full overflow-hidden">
            {/* Top Bar for View Title */}
            <div className="bg-gradient-to-r from-[#00A8E8]/80 to-transparent text-white px-4 py-2 mb-2 rounded-l border-l-4 border-white shadow-lg flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2">
                     <div className="bg-white p-1 rounded text-[#00A8E8]"><LayoutGrid size={16}/></div>
                     <h2 className="text-lg font-bold uppercase">{title}</h2>
                  </div>
                  
                  {/* Equipment Selector */}
                  <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded border border-white/20">
                    <span className="text-[10px] text-gray-300 uppercase font-bold tracking-wider">{t.equipmentList}</span>
                    <select 
                        className="bg-transparent text-[#00A8E8] font-bold outline-none text-sm cursor-pointer [&>option]:bg-gray-800"
                        onChange={(e) => setData((prev: any) => ({...prev, model: e.target.value}))}
                        value={data.model}
                    >
                      <option value="5T MODEL">{t.crane5T}</option>
                      <option value="15T MODEL">{t.crane15T}</option>
                    </select>
                    <ChevronRight size={14} className="text-gray-400" />
                  </div>
            </div>
            
            <div className="flex-1 relative overflow-hidden rounded-lg border border-gray-700 bg-gray-900/90 shadow-2xl">
                {children}
            </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-[200px] bg-[#1e293b] border-l border-gray-600 p-2 absolute right-0 top-0 bottom-0 shadow-2xl z-10 flex flex-col justify-between">
            <div className="space-y-1 mt-2">
                <SideButton 
                label={t.remoteControl} 
                icon={Power} 
                active={currentView === ViewState.REMOTE_CONTROL} 
                onClick={() => setCurrentView(ViewState.REMOTE_CONTROL)} 
                />
                <SideButton 
                label={t.parameterSetting} 
                icon={Settings} 
                active={currentView === ViewState.PARAMETER_SETTING} 
                onClick={() => setCurrentView(ViewState.PARAMETER_SETTING)} 
                />
                <SideButton 
                label={t.maintenanceRecord} 
                icon={ClipboardList} 
                active={currentView === ViewState.MAINTENANCE_RECORD} 
                onClick={() => setCurrentView(ViewState.MAINTENANCE_RECORD)} 
                />
                <SideButton 
                label={t.repairRecord} 
                icon={Wrench} 
                active={currentView === ViewState.REPAIR_RECORD} 
                onClick={() => setCurrentView(ViewState.REPAIR_RECORD)} 
                />
                 <SideButton 
                label={t.statAlarm} 
                icon={AlertCircle} 
                active={currentView === ViewState.ALARM_HISTORY} 
                onClick={() => setCurrentView(ViewState.ALARM_HISTORY)} 
                />
            </div>
            
            <div className="mb-2">
                 <SideButton 
                    label={t.help} 
                    icon={HelpCircle} 
                    active={currentView === ViewState.HELP} 
                    onClick={() => setCurrentView(ViewState.HELP)} 
                    colorClass="from-slate-700 to-slate-800"
                />
            </div>
        </aside>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  // --- Global State ---
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString('en-GB', DATE_OPTIONS));
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const [alarmHistory, setAlarmHistory] = useState<Alarm[]>(INITIAL_ALARMS);
  const [records, setRecords] = useState<MaintenanceEntry[]>(INITIAL_RECORDS);
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  
  // Equipment Simulation State
  const [data, setData] = useState<EquipmentData>({
    oilTemp: 45.0,
    windSpeed: 12.5,
    liftingWeight: 2.06,
    speed: 10.2,
    mainAngle: 27.2,
    ropeLength: 2.8,
    workRadius: 9.6,
    model: '5T MODEL',
    status: 'Running'
  });

  // Parameters State
  const [params, setParams] = useState<SystemParameters>({
      liftingWeightLimit: 5.1,
      warning90: 4.5,
      alarm110: 5.5
  });

  // --- Logic Effects ---
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('en-GB', DATE_OPTIONS));
      
      // Physics Simulation
      setData(prev => {
          let newTemp = prev.oilTemp + (Math.random() - 0.5) * 0.5;
          // Clamp temp
          if (newTemp > 95) newTemp = 95;
          if (newTemp < 40) newTemp = 40;

          return {
            ...prev,
            oilTemp: newTemp,
            windSpeed: Math.max(0, Math.min(30, prev.windSpeed + (Math.random() - 0.5))),
          };
      });

    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check Alarms based on Data
  useEffect(() => {
      if (data.liftingWeight > params.alarm110) {
          triggerAlarm({
              code: 'OVLD 004',
              message: 'Lifting Weight to 110% Lifting Overload.', // Static for fallback, visual update handles logic
              type: 'ALARM',
              timestamp: new Date().toLocaleString(),
              active: true
          });
      } else if (data.oilTemp > 90) {
          triggerAlarm({
              code: 'MSOL-3002',
              message: 'Oil Temperature Too High.',
              type: 'WARNING',
              timestamp: new Date().toLocaleString(),
              active: true
          });
      }
  }, [data.liftingWeight, data.oilTemp, params.alarm110]);

  const triggerAlarm = useCallback((alarm: Alarm) => {
      setActiveAlarm(prev => {
          if (prev?.code === alarm.code) return prev;
          setAlarmHistory(h => [alarm, ...h]);
          return alarm;
      });
  }, []);

  // --- Actions ---
  const handleControl = useCallback((action: string) => {
      setData(prev => {
          const newData = { ...prev };
          switch(action) {
              case 'HOIST_UP': newData.ropeLength = Math.max(0, prev.ropeLength - 0.5); break;
              case 'HOIST_DOWN': newData.ropeLength += 0.5; break;
              case 'LUFF_UP': newData.mainAngle = Math.min(85, prev.mainAngle + 2); break;
              case 'LUFF_DOWN': newData.mainAngle = Math.max(0, prev.mainAngle - 2); break;
              case 'SLEW_CW': /* Visual only */ break;
              case 'SLEW_CCW': /* Visual only */ break;
          }
          // Recalculate radius roughly based on angle
          newData.workRadius = Math.cos(newData.mainAngle * Math.PI / 180) * 12; // 12m boom
          return newData;
      });
  }, []);

  const saveParameter = useCallback((newParams: SystemParameters) => {
      setParams(newParams);
      alert("Parameters Saved Successfully!");
  }, []);

  const saveRecord = useCallback((record: MaintenanceEntry) => {
      setRecords(prev => [record, ...prev]);
      alert("Record Saved Successfully!");
      setCurrentView(ViewState.MAINTENANCE_RECORD);
  }, []);

  // --- Main Render Switch ---
  if (currentView === ViewState.LANDING) {
      return (
          <LandingView 
            setCurrentView={setCurrentView} 
            alarmHistory={alarmHistory}
            language={language}
            setLanguage={setLanguage}
          />
      );
  }

  // Determine Title based on View
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  let currentTitle = currentView.replace('_', ' ');
  if (currentView === ViewState.DASHBOARD) {
      currentTitle = data.model === '5T MODEL' ? t.crane5T : t.crane15T;
  } else if (currentView === ViewState.MAINTENANCE_RECORD) {
      currentTitle = t.maintenanceRecord;
  } else if (currentView === ViewState.REPAIR_RECORD) {
      currentTitle = t.repairRecord;
  } else if (currentView === ViewState.PARAMETER_SETTING) {
      currentTitle = t.parameterSetting;
  } else if (currentView === ViewState.REMOTE_CONTROL) {
      currentTitle = t.remoteControl;
  } else if (currentView === ViewState.ALARM_HISTORY) {
      currentTitle = t.statAlarm;
  } else if (currentView === ViewState.HELP) {
      currentTitle = t.help;
  }

  // Resolve active alarm text
  const activeAlarmCode = activeAlarm ? activeAlarm.code : null;
  const activeAlarmMessage = activeAlarmCode ? (t.alarms[activeAlarmCode as keyof typeof t.alarms] || activeAlarm?.message) : '';
  const activeAlarmType = activeAlarm ? activeAlarm.type : 'ALARM';

  return (
    <>
        <SystemLayout 
            title={currentTitle}
            currentView={currentView}
            setCurrentView={setCurrentView}
            currentTime={currentTime}
            data={data}
            setData={setData}
            language={language}
            setLanguage={setLanguage}
        >
            {currentView === ViewState.DASHBOARD && <DashboardView data={data} activeAlarm={activeAlarm} setActiveAlarm={setActiveAlarm} language={language} />}
            {currentView === ViewState.REMOTE_CONTROL && <RemoteControlView data={data} params={params} activeAlarm={activeAlarm} handleControl={handleControl} setCurrentView={setCurrentView} language={language} />}
            {currentView === ViewState.PARAMETER_SETTING && <ParameterView data={data} params={params} saveParameter={saveParameter} setCurrentView={setCurrentView} language={language} />}
            {currentView === ViewState.MAINTENANCE_RECORD && <RecordView type="Maintenance" setCurrentView={setCurrentView} saveRecord={saveRecord} language={language} />}
            {currentView === ViewState.REPAIR_RECORD && <RecordView type="Repair" setCurrentView={setCurrentView} saveRecord={saveRecord} language={language} />}
            {currentView === ViewState.ALARM_HISTORY && <AlarmHistoryView alarmHistory={alarmHistory} setCurrentView={setCurrentView} language={language} />}
            {currentView === ViewState.HELP && <HelpView setCurrentView={setCurrentView} language={language} />}
        </SystemLayout>
        
        {/* Global Alarm Modal - Pass translated strings */}
        <AlarmModal 
            alarm={activeAlarm ? { ...activeAlarm, message: activeAlarmMessage } : null} 
            onClose={() => setActiveAlarm(null)}
            labels={{
                alarmCode: t.alarmCode,
                warningCode: t.warningCode,
                alarmInfo: t.alarmInfo,
                warningInfo: t.warningInfo,
                acknowledge: t.acknowledge
            }}
        />
    </>
  );
};

export default App;