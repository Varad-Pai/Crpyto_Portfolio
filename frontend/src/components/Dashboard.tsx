import React, { useState, useEffect } from 'react';
import { getPortfolio, addMoney, buyAsset, sellAsset, removeAuthToken, isAuthenticated } from '../services/api';
import type { Portfolio, Asset } from '../services/api';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showBuyAsset, setShowBuyAsset] = useState(false);
  const [showSellAsset, setShowSellAsset] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  
  // Form states
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  const [buySymbol, setBuySymbol] = useState('');
  const [buyQuantity, setBuyQuantity] = useState('');
  const [sellQuantity, setSellQuantity] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const data = await getPortfolio();
      setPortfolio(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addMoneyAmount || parseFloat(addMoneyAmount) <= 0) return;
    
    try {
      await addMoney(parseFloat(addMoneyAmount));
      setAddMoneyAmount('');
      setShowAddMoney(false);
      fetchPortfolio();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add money');
    }
  };

  const handleBuyAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buySymbol || !buyQuantity || parseFloat(buyQuantity) <= 0) return;
    
    try {
      await buyAsset(buySymbol.toUpperCase(), parseFloat(buyQuantity));
      setBuySymbol('');
      setBuyQuantity('');
      setShowBuyAsset(false);
      fetchPortfolio();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to buy asset');
    }
  };

  const handleSellAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset || !sellQuantity || parseFloat(sellQuantity) <= 0) return;
    
    try {
      await sellAsset(selectedAsset.symbol, parseFloat(sellQuantity));
      setSellQuantity('');
      setShowSellAsset(false);
      setSelectedAsset(null);
      fetchPortfolio();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sell asset');
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    window.location.href = '/login';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const getPerformanceColor = (value: number) => {
    return value >= 0 ? '#10b981' : '#ef4444';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchPortfolio} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  if (!portfolio) {
    return <div>No portfolio data available</div>;
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Crypto Portfolio Dashboard</h1>
        <div className="header-actions">
          <button onClick={() => setShowAddMoney(true)} className="btn btn-success">
            Add Money
          </button>
          <button onClick={() => setShowBuyAsset(true)} className="btn btn-primary">
            Buy Asset
          </button>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </header>

      {/* Portfolio Overview */}
      <section className="portfolio-overview">
        <h2>Portfolio Overview</h2>
        <div className="overview-grid">
          <div className="overview-card">
            <h3>Total Invested</h3>
            <p className="amount">{formatCurrency(portfolio.total_added_money)}</p>
          </div>
          <div className="overview-card">
            <h3>Available Cash</h3>
            <p className="amount">{formatCurrency(portfolio.available_money)}</p>
          </div>
          <div className="overview-card">
            <h3>Total Value</h3>
            <p className="amount">{formatCurrency(portfolio.total_value)}</p>
          </div>
          <div className="overview-card">
            <h3>Total Performance</h3>
            <p className="amount" style={{ color: getPerformanceColor(portfolio.performance_abs) }}>
              {formatCurrency(portfolio.performance_abs)}
            </p>
            <p className="percentage" style={{ color: getPerformanceColor(portfolio.performance_rel) }}>
              {formatPercentage(portfolio.performance_rel)}
            </p>
          </div>
        </div>
      </section>

      {/* Assets */}
      <section className="assets-section">
        <h2>Your Assets</h2>
        {portfolio.assets.length === 0 ? (
          <div className="no-assets">
            <p>You don't have any assets yet. Start by buying some crypto!</p>
          </div>
        ) : (
          <div className="assets-grid">
            {portfolio.assets.map((asset) => (
              <div key={asset.symbol} className="asset-card">
                <div className="asset-header">
                  <h3>{asset.symbol}</h3>
                  <button 
                    onClick={() => {
                      setSelectedAsset(asset);
                      setShowSellAsset(true);
                    }}
                    className="btn btn-outline"
                  >
                    Sell
                  </button>
                </div>
                <div className="asset-details">
                  <div className="asset-row">
                    <span>Quantity:</span>
                    <span>{asset.quantity.toFixed(6)}</span>
                  </div>
                  <div className="asset-row">
                    <span>Current Price:</span>
                    <span>{formatCurrency(asset.current_price)}</span>
                  </div>
                  <div className="asset-row">
                    <span>Total Value:</span>
                    <span>{formatCurrency(asset.total_value)}</span>
                  </div>
                  <div className="asset-row">
                    <span>Performance:</span>
                    <span style={{ color: getPerformanceColor(asset.performance_abs) }}>
                      {formatCurrency(asset.performance_abs)}
                    </span>
                  </div>
                  <div className="asset-row">
                    <span>Performance %:</span>
                    <span style={{ color: getPerformanceColor(asset.performance_rel) }}>
                      {formatPercentage(asset.performance_rel)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Money to Portfolio</h3>
            <form onSubmit={handleAddMoney}>
              <div className="form-group">
                <label htmlFor="amount">Amount (USD)</label>
                <input
                  type="number"
                  id="amount"
                  value={addMoneyAmount}
                  onChange={(e) => setAddMoneyAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddMoney(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Add Money
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Buy Asset Modal */}
      {showBuyAsset && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Buy New Asset</h3>
            <form onSubmit={handleBuyAsset}>
              <div className="form-group">
                <label htmlFor="symbol">Symbol (e.g., BTC, ETH)</label>
                <input
                  type="text"
                  id="symbol"
                  value={buySymbol}
                  onChange={(e) => setBuySymbol(e.target.value)}
                  placeholder="Enter crypto symbol"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  value={buyQuantity}
                  onChange={(e) => setBuyQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  min="0"
                  step="0.000001"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowBuyAsset(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Buy Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sell Asset Modal */}
      {showSellAsset && selectedAsset && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Sell {selectedAsset.symbol}</h3>
            <p>Available: {selectedAsset.quantity.toFixed(6)} {selectedAsset.symbol}</p>
            <form onSubmit={handleSellAsset}>
              <div className="form-group">
                <label htmlFor="sellQuantity">Quantity to Sell</label>
                <input
                  type="number"
                  id="sellQuantity"
                  value={sellQuantity}
                  onChange={(e) => setSellQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  min="0"
                  max={selectedAsset.quantity}
                  step="0.000001"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowSellAsset(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger">
                  Sell Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
