    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>


    <script type="text/javascript">

        function checkupdate(){


            $(document).ready(function () {
                $.ajax({
                    type: "POST",
                    url: 'pcsstatus.php',                   
                    datatype: 'json',

                    success: function(data) {                    
                    var dataval = data[0].CPUON;
                    if (dataval < 100) {
                        $('.progress').attr("data-amount",dataval)
                        $('.progress .amount').css("width", 100 - dataval + "%");
                    }
                        
                    }
                });                


            }); 


        }
        checkupdate();  
        $(document).ready(function() {
            setInterval("checkupdate()", 1000); 
        }); 
    </script>