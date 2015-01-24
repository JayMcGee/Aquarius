<?php
    function getLastUpdate($_qty, $_conn)
    {
        $_sql = "SELECT * FROM sensorData ORDER BY date DESC LIMIT " . $_qty . ";";
        return $_conn->query($_sql);
    }    
    
    //Structure d'un compte FMAudit
	class DataRow {
        const NOM_TABLE = "sensorData";

        const ID = "id";
        const DATE = "date";

        const WATER_TEMP = "water_temp";
        const WATER_PH = "water_ph";
        const WATER_DO = "water_do";
        const WATER_CONDUC = "water_conduc";

        const CASE_TEMP = "case_temp";
        const CASE_HUM = "case_humidity";

 
        
         function DataRow($row)
        {
            $this->ID = $row[self::ID];
            $this->Date = $row[self::DATE];
            $this->waterTemp = $row[self::WATER_TEMP];
            $this->waterPh = $row[self::WATER_PH];
            $this->waterDo = $row[self::WATER_DO];
            $this->waterConduc = $row[self::WATER_CONDUC];
            $this->caseTemp = $row[self::CASE_TEMP];
            $this->caseHum = $row[self::CASE_HUM];
        }
        
		function DataRowAssign($id, $date, $waterTemp, $waterPh, $waterDo, $waterConduc, $caseTemp, $caseHum)
        {
            $this->ID = $id;
            $this->Date = $date;
            $this->waterTemp = $waterTemp;
            $this->waterPh = $waterPh;
            $this->waterDo = $waterDo;
            $this->waterConduc = $waterConduc;
            $this->caseTemp = $caseTemp;
            $this->caseHum = $caseHum;
		}	
	}

    function getCelsius($tempF)
    {
        return ($tempF - 32) / 1.8;
    }
    function getKpaFromInMg($inMG)
    {
        return $inMG * 3.386;
    }

    $servername = "localhost";
    $username = "beaglebone";
    $password = "poutine";
    $dbname = "aquariusStation";
    // Create connection
    $conn = mysqli_connect($servername, $username, $password, $dbname);
    
    // Check connection
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }
    //echo "Connected successfully";
?>