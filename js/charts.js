// Activity Chart
const ctxActivity = document.getElementById('activityChart').getContext('2d');
new Chart(ctxActivity, {
    type: 'line',
    data: {
        labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
        datasets: [{
            label: 'Çalışma Süresi (dk)',
            data: [20, 35, 15, 45, 30, 60, 40],
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: { beginAtZero: true }
        }
    }
});

// Success Rate Chart
const ctxSuccess = document.getElementById('successChart').getContext('2d');
new Chart(ctxSuccess, {
    type: 'bar',
    data: {
        labels: ['Harfler', 'Sayılar', 'Selamlaşma', 'Aile', 'Renkler'],
        datasets: [{
            label: 'Başarı %',
            data: [95, 88, 70, 40, 0],
            backgroundColor: [
                '#22c55e',
                '#22c55e',
                '#3b82f6',
                '#f59e0b',
                '#e2e8f0'
            ],
            borderRadius: 8
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: { 
                beginAtZero: true,
                max: 100
            }
        }
    }
});
