import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setLoading(false);
                return;
            }
            const response = await axios.get(`/api/orders/user/${userId}`);
            // Sort orders by date descending (newest first)
            const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    if (loading) return <div className="loading" style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Loading orders...</div>;
    if (!localStorage.getItem('token')) return <div className="container" style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Please login to view your orders</div>;

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>My Orders</h2>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', background: '#1e1e1e', borderRadius: '8px' }}>
                    <p style={{ color: '#aaa', fontSize: '1.1rem' }}>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {orders.map(order => (
                        <div key={order._id} style={{ background: '#1e1e1e', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>

                            {/* Order Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Order ID: <span style={{ fontFamily: 'monospace', color: '#ccc' }}>{order._id}</span></p>
                                    <p style={{ color: '#888', fontSize: '0.9rem' }}>Date: <span style={{ color: 'white' }}>{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</span></p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '4px',
                                        fontSize: '0.85rem',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        background: order.status === 'completed' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                                        color: order.status === 'completed' ? '#4caf50' : '#ff9800'
                                    }}>
                                        {order.status}
                                    </span>
                                    <p style={{ marginTop: '0.5rem', color: '#ccc', fontSize: '0.9rem' }}>Payment: <b style={{ textTransform: 'uppercase' }}>{order.paymentMethod || 'Generic'}</b></p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {order.items.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ color: '#ff9800', fontWeight: 'bold' }}>{item.quantity}x</span>
                                            <span style={{ color: 'white' }}>{item.name || 'Product'}</span>
                                        </div>
                                        <span style={{ color: '#ccc' }}>${item.price}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Order Footer */}
                            <div style={{ borderTop: '1px solid #333', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '0.9rem', color: '#888' }}>
                                    Ship to: {order.shippingAddress.city}, {order.shippingAddress.state}
                                </div>
                                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#ff9800' }}>
                                    Total: ${order.totalAmount.toFixed(2)}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Orders;
