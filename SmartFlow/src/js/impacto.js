   document.addEventListener('DOMContentLoaded', function() {
            new Chart(document.getElementById('emissChart'), {
                type: 'line',
                data: {
                    labels: ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV'],
                    datasets: [{
                        data: [12, 18, 22, 30, 38, 50, 60, 52, 42, 55, 72],
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(17,17,17,0.8)',
                        fill: true,
                        tension: 0.45,
                        pointRadius: 0,
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: { x: { display: false }, y: { display: false } }
                }
            });

            lucide.createIcons();
        });