import { LightningElement } from 'lwc';
import { getBarcodeScanner } from 'lightning/mobileCapabilities';

export default class BarcodeScanningDemoComponent extends LightningElement {
    myScanner;
    scannedBarcode = '';
    errorString = '';

    startScanning(){
        this.myScanner = getBarcodeScanner(); //get instance of BarcodeScanner
        if(this.myScanner != null && this.myScanner.isAvailable()){ // check if scanner is available on this device
            const scannigOptions = {                                // Object which is a input parameter for beginCapture
                barcodeTypes    : [this.myScanner.barcodeTypes.QR],
                instrctionText  : 'Please scan valid QR code',
                successText     : 'Scanning is Successful.'
            };
            this.myScanner.beginCapture(scannigOptions)
                    .then((result) => {
                        this.scannedBarcode = result.value;
                    })
                    .catch((error) => {
                        if(error.code == 'userDismissedScanner'){
                            this.errorString = 'You have cancelled the scanning.'
                        }else{
                            this.errorString = error.message;
                        }
                    })
                    .finally(() =>{
                        this.myScanner.endCapture(); // This will end the scanning session
                    });
        }else{
            console.log('Scanner is not available on this device.');
        }
    }
}