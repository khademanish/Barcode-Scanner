import { LightningElement , track } from 'lwc';
import { getBarcodeScanner } from 'lightning/mobileCapabilities';

export default class MultipleBarcodeScanningDemo extends LightningElement {
    myScanner;
    @track scannedBarcodes;
    errorString = '';

    startScanning(){
        this.myScanner = getBarcodeScanner();
        if(this.myScanner != null && this.myScanner.isAvailable()){
            const scanningOptions = {
                barcodeTypes    : [this.myScanner.barcodeTypes.QR],
                instrctionText  : 'Please scan valid QR code',
                successText     : 'Scanning is Successful.'
            }

            this.myScanner.beginCapture(scanningOptions)
                .then((result) => {
                    this.processScannedBarcode(result);
                    this.continueScanning();
                })
                .catch((error) => {
                    this.processError(error);
                    this.myScanner.endCapture();
                })
        }else{
            console.log('Scanner is not available on this device.');
        }
    }

    processScannedBarcode(scannedBarcode){
        this.scannedBarcodes.push(scannedBarcode);
    }

    continueScanning(){
        this.myScanner.resumeCapture()
            .then((result) => {
                this.processScannedBarcode(result);
                this.continueScanning();    
            })
            .catch((error) => {
                this.processError(error);
                this.myScanner.endCapture();
            })
    }

    processError(error){
        if(error.code == 'userDismissedScanner'){
            this.errorString = 'You have cancelled the scanning.'
        }else{
            this.errorString = error.message;
        }
    }

    get scannedBarcodesAsString() {
        return this.scannedBarcodes.map(barcodeResult => {
            return barcodeResult.value;
        }).join('\n\n');
    }
}