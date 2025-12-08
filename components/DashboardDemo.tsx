import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, CheckCircle, Package, ShoppingCart, ScanLine, TrendingUp, Loader2 } from 'lucide-react';
import { NeoButton } from './NeoButton';
import { StockItem, ConsumptionData } from '../types';
import { supabase } from '../lib/supabaseClient';

const MOCK_DATA: ConsumptionData[] = [
  { day: 'Lun', value: 45 },
  { day: 'Mar', value: 52 },
  { day: 'Mer', value: 38 },
  { day: 'Jeu', value: 65 },
  { day: 'Ven', value: 48 },
  { day: 'Sam', value: 90 },
  { day: 'Dim', value: 85 },
];

// Fallback data in case DB is empty or connection fails
const INITIAL_STOCK_FALLBACK: StockItem[] = [
  { id: '1', name: 'Lait demi-écrémé (Demo)', category: 'Food', quantity: 1, unit: 'L', threshold: 2, status: 'CRITICAL' },
  { id: '2', name: 'Café grains (Demo)', category: 'Food', quantity: 500, unit: 'g', threshold: 200, status: 'OK' },
];

export const DashboardDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stock' | 'stats'>('stock');
  const [stocks, setStocks] = useState<StockItem[]>(INITIAL_STOCK_FALLBACK);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch stocks from Supabase
  const fetchStocks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('stocks')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.warn('Erreur fetch Supabase (Table "stocks" existe-t-elle ?):', error);
        // On garde les données de fallback si erreur (ex: table n'existe pas encore)
      } else if (data && data.length > 0) {
        setStocks(data as StockItem[]);
      }
    } catch (e) {
      console.error('Exception fetch:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Insert a mock product
  const handleAddProduct = async () => {
    setIsAdding(true);
    try {
      const newProduct = {
        name: `Produit Test ${Math.floor(Math.random() * 100)}`,
        category: 'Food',
        quantity: 1,
        unit: 'kg',
        threshold: 1,
        status: 'OK'
      };

      const { data, error } = await supabase
        .from('stocks')
        .insert([newProduct])
        .select();

      if (error) {
        alert("Erreur lors de l'ajout (Vérifiez que la table 'stocks' existe dans Supabase).");
        console.error(error);
      } else {
        // Refresh list
        await fetchStocks();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    
    // Subscribe to realtime changes (Bonus)
    const channel = supabase
      .channel('stocks_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stocks' }, () => {
        fetchStocks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 bg-givd-dark rounded-none border-4 border-givd-dark shadow-neo relative overflow-hidden">
      {/* Fake Browser Bar */}
      <div className="flex items-center gap-2 mb-6 border-b-2 border-gray-700 pb-4">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <div className="ml-4 bg-gray-800 px-3 py-1 rounded text-xs text-gray-400 font-mono flex-1 flex justify-between items-center">
          <span>givd.app/dashboard/home</span>
          <span className="flex items-center gap-1 text-green-500"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Live</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex flex-col gap-4">
          <div className="bg-white p-4 border-2 border-givd-dark shadow-neo-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-givd-blue rounded-full border-2 border-givd-dark flex items-center justify-center text-white font-bold">JD</div>
              <div>
                <p className="font-bold text-sm">John Doe</p>
                <p className="text-xs text-gray-500">Connecté</p>
              </div>
            </div>
            <NeoButton size="sm" className="w-full flex items-center justify-center gap-2">
              <ScanLine size={16} /> Scan Ticket
            </NeoButton>
          </div>

          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('stock')}
              className={`text-left px-4 py-3 border-2 border-givd-dark font-bold transition-all ${activeTab === 'stock' ? 'bg-givd-green shadow-neo-sm translate-x-[-2px] translate-y-[-2px]' : 'bg-gray-100 hover:bg-white'}`}
            >
              📦 Mes Stocks
            </button>
            <button 
               onClick={() => setActiveTab('stats')}
              className={`text-left px-4 py-3 border-2 border-givd-dark font-bold transition-all ${activeTab === 'stats' ? 'bg-givd-blue text-white shadow-neo-sm translate-x-[-2px] translate-y-[-2px]' : 'bg-gray-100 hover:bg-white'}`}
            >
              📊 Consommation
            </button>
            <div className="px-4 py-3 border-2 border-givd-dark bg-gray-100 opacity-50 cursor-not-allowed">
              🛒 Liste Auto
            </div>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-gray-100 border-2 border-givd-dark p-6 shadow-neo-sm min-h-[400px]">
          {activeTab === 'stock' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-display font-bold">État des Stocks</h3>
                    {isLoading && <Loader2 className="animate-spin text-givd-blue" size={20}/>}
                </div>
                <div className="flex gap-2">
                    <span className="bg-givd-orange px-3 py-1 text-sm font-bold border-2 border-givd-dark flex items-center">
                    {stocks.filter(i => i.status !== 'OK').length} Alertes
                    </span>
                    <button 
                        onClick={handleAddProduct}
                        disabled={isAdding}
                        className="bg-white hover:bg-gray-100 px-3 py-1 text-sm font-bold border-2 border-givd-dark disabled:opacity-50"
                    >
                        {isAdding ? '...' : '+ Test Insert'}
                    </button>
                </div>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {stocks.map((item) => (
                  <div key={item.id} className="bg-white p-4 border-2 border-givd-dark flex justify-between items-center hover:translate-x-1 transition-transform cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full border border-black ${
                        item.status === 'OK' ? 'bg-givd-green' : 
                        item.status === 'LOW' ? 'bg-givd-orange' : 'bg-red-500 animate-pulse'
                      }`} />
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.quantity} {item.unit} (Seuil: {item.threshold})</p>
                      </div>
                    </div>
                    {item.status !== 'OK' && (
                      <NeoButton size="sm" variant="alert" className="text-xs py-1 px-2">
                        + Ajouter
                      </NeoButton>
                    )}
                  </div>
                ))}
                {stocks.length === 0 && !isLoading && (
                    <div className="text-center py-8 text-gray-500 italic">
                        Aucun stock trouvé dans Supabase.
                    </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-display font-bold">Analyse Hebdo</h3>
                <TrendingUp className="text-givd-blue" />
              </div>
              
              <div className="bg-white p-2 border-2 border-givd-dark h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_DATA}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3A7AFE" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3A7AFE" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#1F1F1F', fontSize: 12}} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ border: '2px solid #1F1F1F', boxShadow: '4px 4px 0px 0px #1F1F1F', borderRadius: '0' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#3A7AFE" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-givd-green p-4 border-2 border-givd-dark">
                  <p className="text-xs font-bold uppercase">Budget Restant</p>
                  <p className="text-2xl font-display font-bold">124.50 €</p>
                </div>
                <div className="bg-white p-4 border-2 border-givd-dark">
                  <p className="text-xs font-bold uppercase text-gray-500">Total Dépensé</p>
                  <p className="text-2xl font-display font-bold">342.10 €</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};