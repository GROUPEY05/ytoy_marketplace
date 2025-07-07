import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const COLORS = [
  '#FF6F00',
  '#2196F3',
  '#4CAF50',
  '#FFC107',
  '#9C27B0',
  '#F44336',
  '#3F51B5',
  '#E91E63',
  '#00BCD4',
  '#CDDC39'
]

const CategoryPieChart = ({ categoryDistribution }) => {
  if (
    !categoryDistribution ||
    !categoryDistribution.labels ||   
    !categoryDistribution.values       
  ) {
    return (
      <div className='text-center py-5'>
        <p>Aucune donnée disponible</p>
      </div>
    )
  }
  const data = categoryDistribution.labels.map((label, index) => ({
    name: label,
    value: categoryDistribution.values[index]
  }))
  console.log('CategoryPieChart data:', categoryDistribution);

  return (
    <div className='my-4'>
      <h4 className='mb-3'>Répartition par catégorie</h4>
      {data.length > 0 ? (
        <ResponsiveContainer width='100%' height={300}>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              labelLine={false}
              outerRadius={100}
              fill='#8884d8'
              dataKey='value'
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(1)}%)`
              }
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={value => `${value} produits`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className='text-center py-5'>
          <p>Aucune donnée disponible</p>
        </div>
      )}
    </div>
  )
}

export default CategoryPieChart
