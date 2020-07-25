import React from 'react';
import './searchui-react-component.scss';

export class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            search: '',
            results: [],
            activeItems: [] // store results indexes
        };

        this.jsonData = [
            {
                role: 'مدیر',
                name: 'جناب آقای محمدعلی جوانمردی',
                phone: '09174567895',
                description: 'هیئت مدیره در شرکت فرودجا'
            },
            {
                role: 'مخاطب حقیقی',
                name: 'جناب آقای محمد جوانمردی',
                phone: '09174567895',
                description: 'هیئت مدیره در شرکت ساکوک'
            },
            {
                role: 'کاربر',
                name: 'جناب آقای علی امینی',
                phone: '09107531724',
                description: 'برنامه نویس در شرکت ساکوک'
            },
            {
                role: 'کاربر',
                name: 'سرکار خانم عادله رضایی',
                phone: '09190001122',
                description: 'مدیر فروش در شرکت ساکوک'
            },
            {
                role: 'مخاطب حقوقی',
                name: 'سرکار خانم زهره زارعی نژاد',
                phone: '09190001122',
                description: 'برنامه نویس در شرکت ساکوک'
            },
        ];

        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    handleSearchChange(event) {
        const searchText = event.target.value;
        this.setState({search: searchText, activeItems: []});

        if(this.state.search.length > 1) {
            this.searchResults(searchText)
            // use arrowFunction for ability to get parent `this` scope
            .then(results => {
                this.setState({results: results});
            })
        } else {
            this.setState({results: []});
        }
    }

    render() {
        return (
            <div className="search-box">
                <label>
                    <span>سرچ: </span>
                    <input type="text" value={this.state.search} onChange={this.handleSearchChange} />
                    
                    
                    <p className="muted">
                        راهنما: کلمۀ «جوانمردی»، «خانم»، «ساکوک» یا «فرودجا» را در فیلد بالا سرچ کنید.
                    </p>
                </label>

                {this.state.search.length > 1 && 
                    <div className="results">
                        <h3>نتایج برای: {this.state.search}</h3>

                        <ul className="contact-list">
                            {this.state.results.map((contact, index) => (
                                <li className={this.isSelected(index)? 'item selected' : 'item'} key={index}>
                                    <span className="role muted">{contact.role}</span>
                                    <div className="name">
                                        {this.textHighlight(contact.name, this.state.search)} 
                                        
                                        <span className="select" onClick={() => this.handleSelect(index)}>
                                                {this.isSelected(index)? "لغو انتخاب"
                                                : "انتخاب"}
                                        </span>
                                        
                                        <div className="phone muted">
                                            {this.textHighlight(contact.phone, this.state.search)}
                                        </div>
                                    </div>
                                    <div className="desc">
                                        {this.textHighlight(contact.description, this.state.search)}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                }

            </div>
        );
    }

    // toggle select
    handleSelect(index) {
        const isSelected = this.isSelected(index);
        const activeItems = this.state.activeItems;

        if(!isSelected) {
            activeItems.push(index);
        } else {
            let findIndex = activeItems.findIndex(number => number == index);
            activeItems.splice(findIndex, 1);
        }

        // set state
        this.setState({activeItems: activeItems});
    }
    
    // return Boolean: item selected or not
    isSelected(index) {
        console.log('actived items: ', this.state.activeItems, this.state.activeItems.indexOf(index) > -1);
        return this.state.activeItems.indexOf(index) > -1;
    }

    // return text in <span> and highlight it with <mark> tag
    textHighlight(text, highlitedText) {
        const regexp = new RegExp(`(${highlitedText})`, 'ig');
        let htmlText = text.replace(regexp, `<mark>$1</mark>`);

        return (
            <span dangerouslySetInnerHTML={{ __html: htmlText }} />
        );
    }


    /**
     * get json data
     * 
     * @return {Promise<Array>} data -> array of objects
     */
    getJsonData() {
        const jsonData = this.jsonData;
        return new Promise((resolve, reject) => {
            resolve(jsonData);
        }); 
    }

    /**
     * search text in data and response searcched data
     * 
     * @param {string} searchText 
     * 
     * @return {Promise<Array>} results -> search result
     */
    async searchResults(searchText = '') {
        const results = [];

        if(searchText == '') {
            // return no data if has no searchText
            return [];
        }

        // the parameters we want to serach in:
        const searchInParams =  ['name', 'phone', 'description'];

        // get data like using HTTP requests
        try {
            const responseData = await this.getJsonData();

            // console.log('response data:', responseData);

            // use `for` loops for better performance that Array.prototype.forEach()
            for (let i = 0; i < responseData.length; i++) {
                const data = responseData[i];
                console.log(`data #${i}:`, data);

                // search in specific parameters defined above
                for (let keyIndex = 0; keyIndex < searchInParams.length; keyIndex++) {
                    const key = searchInParams[keyIndex];
                    console.log('key:', key);

                    // do search!
                    if (data[key].indexOf(searchText) > -1) {
                        results.push(data);
                        break; // end loop when find at least 1 result to increse code speed
                    }
                }
            }
            return results;
        }
        catch (e) {
            console.log('get json data error:', e);
            return [];
        }
    }
}