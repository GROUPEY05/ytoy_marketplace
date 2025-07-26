import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, ShoppingCart, Package, Calendar } from 'lucide-react';
import AdminSidebar from './AdminSidebar'
const AdminStatistics = () => {
    const [period, setPeriod] = useState('month');
    const [loading, setLoading] = useState(true);
    const [statistics, setStatistics] = useState({
        sales: [],
        topProduits: [],
        salesByCategory: []
    });

    // Données de démonstration basées sur votre controller
    const mockData = {
        month: {
            sales: [
                { date: '2024-01-01', total_orders: 15, total_sales: 2500 },
                { date: '2024-01-02', total_orders: 23, total_sales: 3200 },
                { date: '2024-01-03', total_orders: 18, total_sales: 2800 },
                { date: '2024-01-04', total_orders: 31, total_sales: 4100 },
                { date: '2024-01-05', total_orders: 27, total_sales: 3600 },
                { date: '2024-01-06', total_orders: 22, total_sales: 3100 },
                { date: '2024-01-07', total_orders: 35, total_sales: 4500 }
            ],
            topProduits: [
                { id: 1, nom: 'Smartphone Premium', total_quantity: 145 },
                { id: 2, nom: 'Laptop Gaming', total_quantity: 89 },
                { id: 3, nom: 'Casque Audio', total_quantity: 76 },
                { id: 4, nom: 'Tablette Pro', total_quantity: 67 },
                { id: 5, nom: 'Montre Connectée', total_quantity: 54 }
            ],
            salesByCategory: [
                { nom: 'Électronique', total_sales: 15600 },
                { nom: 'Vêtements', total_sales: 8900 },
                { nom: 'Maison & Jardin', total_sales: 6700 },
                { nom: 'Sport & Loisirs', total_sales: 4200 },
                { nom: 'Livres', total_sales: 2800 }
            ]
        },
        week: {
            sales: [
                { date: '2024-01-15', total_orders: 8, total_sales: 1200 },
                { date: '2024-01-16', total_orders: 12, total_sales: 1800 },
                { date: '2024-01-17', total_orders: 15, total_sales: 2100 },
                { date: '2024-01-18', total_orders: 18, total_sales: 2400 },
                { date: '2024-01-19', total_orders: 22, total_sales: 2900 },
                { date: '2024-01-20', total_orders: 25, total_sales: 3200 },
                { date: '2024-01-21', total_orders: 19, total_sales: 2600 }
            ],
            topProduits: [
                { id: 1, nom: 'Smartphone Premium', total_quantity: 32 },
                { id: 2, nom: 'Laptop Gaming', total_quantity: 18 },
                { id: 3, nom: 'Casque Audio', total_quantity: 15 },
                { id: 4, nom: 'Tablette Pro', total_quantity: 12 },
                { id: 5, nom: 'Montre Connectée', total_quantity: 9 }
            ],
            salesByCategory: [
                { nom: 'Électronique', total_sales: 8200 },
                { nom: 'Vêtements', total_sales: 3400 },
                { nom: 'Maison & Jardin', total_sales: 2100 },
                { nom: 'Sport & Loisirs', total_sales: 1800 },
                { nom: 'Livres', total_sales: 700 }
            ]
        },
        year: {
            sales: [
                { date: '2024-01', total_orders: 420, total_sales: 65000 },
                { date: '2024-02', total_orders: 380, total_sales: 58000 },
                { date: '2024-03', total_orders: 510, total_sales: 78000 },
                { date: '2024-04', total_orders: 460, total_sales: 71000 },
                { date: '2024-05', total_orders: 590, total_sales: 89000 },
                { date: '2024-06', total_orders: 650, total_sales: 95000 }
            ],
            topProduits: [
                { id: 1, nom: 'Smartphone Premium', total_quantity: 890 },
                { id: 2, nom: 'Laptop Gaming', total_quantity: 567 },
                { id: 3, nom: 'Casque Audio', total_quantity: 445 },
                { id: 4, nom: 'Tablette Pro', total_quantity: 378 },
                { id: 5, nom: 'Montre Connectée', total_quantity: 298 }
            ],
            salesByCategory: [
                { nom: 'Électronique', total_sales: 185000 },
                { nom: 'Vêtements', total_sales: 98000 },
                { nom: 'Maison & Jardin', total_sales: 67000 },
                { nom: 'Sport & Loisirs', total_sales: 45000 },
                { nom: 'Livres', total_sales: 28000 }
            ]
        }
    };

    // Simulation de l'appel API
    useEffect(() => {
        const fetchStatistics = async () => {
            setLoading(true);
            // Simulation d'un délai d'API
            await new Promise(resolve => setTimeout(resolve, 800));

            setStatistics(mockData[period]);
            setLoading(false);
        };

        fetchStatistics();
    }, [period]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF'
        }).format(value);
    };

    const getTotalSales = () => {
        return statistics.sales.reduce((sum, item) => sum + parseFloat(item.total_sales), 0);
    };

    const getTotalOrders = () => {
        return statistics.sales.reduce((sum, item) => sum + parseInt(item.total_orders), 0);
    };

    const getAverageOrderValue = () => {
        const totalSales = getTotalSales();
        const totalOrders = getTotalOrders();
        return totalOrders > 0 ? totalSales / totalOrders : 0;
    };

    // Couleurs pour le graphique en secteurs
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-4">
                <div className="container mx-auto">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                        <p className="mt-3 text-gray-600">Chargement des statistiques...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='container-fluid4 '>
            <div className='row'>
                {/* Sidebar */}
                <AdminSidebar />
                <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
                    <div className="min-h-screen bg-gray-100 p-4">
                        <div className="container mx-auto">
                            {/* En-tête */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h1 className="h2 text-dark fw-bold">
                                    <TrendingUp className="me-2" size={32} />
                                    Dashboard Statistiques
                                </h1>

                                {/* Sélecteur de période */}
                                <div className="btn-group" role="group">
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="period"
                                        id="week"
                                        checked={period === 'week'}
                                        onChange={() => setPeriod('week')}
                                    />
                                    <label className="btn btn-outline-primary" htmlFor="week">
                                        Semaine
                                    </label>

                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="period"
                                        id="month"
                                        checked={period === 'month'}
                                        onChange={() => setPeriod('month')}
                                    />
                                    <label className="btn btn-outline-primary" htmlFor="month">
                                        Mois
                                    </label>

                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="period"
                                        id="year"
                                        checked={period === 'year'}
                                        onChange={() => setPeriod('year')}
                                    />
                                    <label className="btn btn-outline-primary" htmlFor="year">
                                        Année
                                    </label>
                                </div>
                            </div>

                            {/* Cartes de résumé */}
                            <div className="row mb-4">
                                <div className="col-md-3 mb-3">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1">
                                                    <h6 className="text-muted mb-1">Ventes totales</h6>
                                                    <h4 className="text-success fw-bold">{formatCurrency(getTotalSales())}</h4>
                                                </div>
                                                <div className="text-success">
                                                    <TrendingUp size={24} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3 mb-3">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1">
                                                    <h6 className="text-muted mb-1">Commandes totales</h6>
                                                    <h4 className="text-primary fw-bold">{getTotalOrders()}</h4>
                                                </div>
                                                <div className="text-primary">
                                                    <ShoppingCart size={24} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3 mb-3">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1">
                                                    <h6 className="text-muted mb-1">Panier moyen</h6>
                                                    <h4 className="text-warning fw-bold">{formatCurrency(getAverageOrderValue())}</h4>
                                                </div>
                                                <div className="text-warning">
                                                    <Package size={24} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3 mb-3">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1">
                                                    <h6 className="text-muted mb-1">Période</h6>
                                                    <h4 className="text-info fw-bold">
                                                        {period === 'week' ? '7 jours' : period === 'month' ? '30 jours' : '12 mois'}
                                                    </h4>
                                                </div>
                                                <div className="text-info">
                                                    <Calendar size={24} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Graphiques principaux */}
                            <div className="row mb-4">
                                {/* Graphique des ventes */}
                                <div className="col-lg-8 mb-4">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header bg-white">
                                            <h5 className="card-title mb-0">Évolution des ventes</h5>
                                        </div>
                                        <div className="card-body">
                                            <ResponsiveContainer width="100%" height={300}>
                                                <LineChart data={statistics.sales}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="date" />
                                                    <YAxis yAxisId="left" orientation="left" />
                                                    <YAxis yAxisId="right" orientation="right" />
                                                    <Tooltip
                                                        formatter={(value, name) => [
                                                            name === 'total_sales' ? formatCurrency(value) : value,
                                                            name === 'total_sales' ? 'Ventes' : 'Commandes'
                                                        ]}
                                                    />
                                                    <Legend />
                                                    <Bar yAxisId="left" dataKey="total_orders" fill="#8884d8" name="Commandes" />
                                                    <Line yAxisId="right" type="monotone" dataKey="total_sales" stroke="#82ca9d" name="Ventes" strokeWidth={3} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                {/* Graphique par catégorie */}
                                <div className="col-lg-4 mb-4">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header bg-white">
                                            <h5 className="card-title mb-0">Ventes par catégorie</h5>
                                        </div>
                                        <div className="card-body">
                                            <ResponsiveContainer width="100%" height={300}>
                                                <PieChart>
                                                    <Pie
                                                        data={statistics.salesByCategory}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={({ nom, percent }) => `${nom} ${(percent * 100).toFixed(0)}%`}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="total_sales"
                                                    >
                                                        {statistics.salesByCategory.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tableaux de données */}
                            <div className="row">
                                {/* Top produits */}
                                <div className="col-lg-6 mb-4">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header bg-white">
                                            <h5 className="card-title mb-0">Top 5 Produits</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="table-responsive">
                                                <table className="table table-hover">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>Rang</th>
                                                            <th>Produit</th>
                                                            <th>Quantité vendue</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {statistics.topProduits.map((produit, index) => (
                                                            <tr key={produit.id}>
                                                                <td>
                                                                    <span className={`badge ${index === 0 ? 'bg-warning' : index === 1 ? 'bg-secondary' : index === 2 ? 'bg-success' : 'bg-primary'}`}>
                                                                        #{index + 1}
                                                                    </span>
                                                                </td>
                                                                <td className="fw-medium">{produit.nom}</td>
                                                                <td>
                                                                    <span className="text-success fw-bold">{produit.total_quantity}</span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Ventes par catégorie détaillées */}
                                <div className="col-lg-6 mb-4">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header bg-white">
                                            <h5 className="card-title mb-0">Détail des ventes par catégorie</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="table-responsive">
                                                <table className="table table-hover">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>Catégorie</th>
                                                            <th>Ventes totales</th>
                                                            <th>Part</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {statistics.salesByCategory.map((category, index) => {
                                                            const totalSales = statistics.salesByCategory.reduce((sum, cat) => sum + parseFloat(cat.total_sales), 0);
                                                            const percentage = ((parseFloat(category.total_sales) / totalSales) * 100).toFixed(1);

                                                            return (
                                                                <tr key={category.nom}>
                                                                    <td className="fw-medium">{category.nom}</td>
                                                                    <td className="text-success fw-bold">{formatCurrency(category.total_sales)}</td>
                                                                    <td>
                                                                        <div className="d-flex align-items-center">
                                                                            <div className="progress flex-grow-1 me-2" style={{ height: '20px' }}>
                                                                                <div
                                                                                    className="progress-bar"
                                                                                    style={{
                                                                                        width: `${percentage}%`,
                                                                                        backgroundColor: COLORS[index % COLORS.length]
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <span className="text-muted small">{percentage}%</span>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminStatistics;