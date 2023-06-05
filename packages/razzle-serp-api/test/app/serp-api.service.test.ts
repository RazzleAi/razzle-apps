import { SerpApiService } from  '../../src/app/serp-api.service'


describe('Test SerpApiService', () => {


    it('should parse a resolved prompt', async () => {
        
        const serpApiService = new SerpApiService()

        const results = await serpApiService.getSearchResults('helloworld')

        console.log(results)

        //TODO: assertions
    })


    it('should run analysis on a URL', async () => {
        
        const serpApiService = new SerpApiService()

        const results = await serpApiService
            .analyze(
                'https://edition.cnn.com/2023/05/17/europe/ukraine-kyiv-air-defense-weapons-intl-hnk-ml/index.html', 
                
                [
                    'INEC',
                    'monkey',
                    'Ukraine',
                    'Russia',
                    'America',
                    'China',
                    'missile attack'
                ]
            )
            .then(result => console.log("Analysis Result: " + JSON.stringify(Array.from(result.entries()))))
            .catch(err => console.error(err));

        console.log(results)

        //TODO: assertions
    
    })


});



