import { SerpApiService } from  '../../src/app/serp-api.service'


describe('Test SerpApiService', () => {


    it('should parse a resolved prompt', async () => {
        
        const serpApiService = new SerpApiService()

        const results = await serpApiService.getSearchResults('helloworld')

        console.log(results)

        //TODO: assertions
    })


});



