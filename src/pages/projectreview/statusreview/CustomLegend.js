/* eslint-disable react/self-closing-comp */
export default function CustomLegend() {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
        <div style={{ width: '10px', height: '10px', backgroundColor: '#228B22', marginRight: '5px' }}></div>
        Closed
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
        <div style={{ width: '10px', height: '10px', backgroundColor: '#FF0000', marginRight: '5px' }}></div>
        Open
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '10px', height: '10px', backgroundColor: '#4169E1', marginRight: '5px' }}></div>
        Reported
      </div>
    </div>
  );
}
