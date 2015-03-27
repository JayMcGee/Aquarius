USE station_aquarius;
SELECT 	t_Data.data_value AS ReadValue,
		t_Data.data_date AS ReadDate,
		t_VirtualSensor.cloudia_id AS CloudiaSubUnitID,
		t_PhysicalSensor.cloudia_unit_id AS CloudiaUnitID,
		t_PhysicalSensor.physical_name AS PhysicalName,
		t_VirtualSensor.virtual_measure_unit AS UnitType
FROM t_Data, t_VirtualSensor, t_PhysicalSensor
WHERE t_Data.data_t_virtual = t_VirtualSensor.virtual_id
	and t_VirtualSensor.virtual_t_physical = t_PhysicalSensor.physical_id
	and t_Data.data_is_sent = 0
ORDER BY  t_Data.data_date, t_PhysicalSensor.cloudia_unit_id, t_VirtualSensor.cloudia_id;