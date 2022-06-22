import { Component, memo } from "react";
import { BagButtonBox, BoxRightCart, BoxRightCurrencyDiv, CartBagPreview, CurrencyOptions, HeaderBoxRight, HeaderContainer, HeaderNavigation, NavigationLinkBox, OptionsValuesBox } from "./style";
import {ReactComponent as Logo} from "../../../assets/images/logo.svg"
import {Link} from 'react-router-dom';
import queryCategories from '../../../services/queryCategories.js';
import { ParagraphRoboto, TitleRalewayH2, TitleRalewayH3 } from "../../foundation/typography";
import queryCurrency from "../../../services/queryCurrency";
import { CurrencyContext } from "../../contexts/currencyContext";
import { ProductsContext } from "../../contexts/productsContext";
import {ReactComponent as Cart} from '../../../assets/images/cart.svg';
import ComponentButton from "../button";
import ComponentItemsCartList from '../itensCartList/index.js';


class ComponentHeader extends Component{

    static contextType = ProductsContext;

    constructor({props}){
        super(props)
        this.state={
            categories: [],
            currencies: [],
            open: false,
            bag: false
        }
    }

    componentDidMount(){
        queryCategories()
        .then(resp => this.setState({categories: resp}))

        queryCurrency()
        .then(resp=>this.setState({
            currencies: resp
        }))
    }

    handleOpenBox(value){  
        this.setState({open: value})
    }

    getFinalPrice(){
        return(
            <CurrencyContext.Consumer>
                {data=>{
                    let total = 0;
                    this.context.cart.forEach(product=>{
                        const price = product.prices.find(price => price.currency.label === data.currency.label);
                        total += price.amount * product.quantity;
                    })
                    return(
                    <ParagraphRoboto>{data.currency.symbol} {total.toFixed(2)}</ParagraphRoboto>
                    )
                }}
            </CurrencyContext.Consumer>
        )
    }

    render(){
        return(
            <HeaderContainer open={this.state.open} bag={this.state.bag}>
                <HeaderNavigation>
                    {this.state.categories.map((category, index)=>{
                        return(
                        <Link key={category.name+index} to="/">
                        <NavigationLinkBox
                        selected={this.context.category == category.name}
                        onClick={(event)=>{
                            this.context.handleCategory(category.name)
                        }} 
                        >
                            <TitleRalewayH2>
                            {category.name.slice(0, 1).toUpperCase() + category.name.slice(1)}
                            </TitleRalewayH2>
                                
                            <span> </span>
                        </NavigationLinkBox>
                        </Link>
                        )
                    })}
                </HeaderNavigation>

                <Logo className="logo"/>
                
                <HeaderBoxRight>
                    <CurrencyContext.Consumer>
                        {currencyData=>{
                            return(
                            <BoxRightCurrencyDiv
                            onClick={()=>this.handleOpenBox(!this.state.open)}
                            onMouseLeave={()=>this.handleOpenBox(false)}
                            open={this.state.open}
                            >
                                <TitleRalewayH3>{currencyData.currency.symbol}</TitleRalewayH3>
                                
                                <span className="arrow">v</span>
                                
                                <CurrencyOptions
                                open={this.state.open}
                                height={this.state.currencies.length*8}
                                >
                                    {this.state.currencies.map((currency, index)=>{
                                        return(
                                        <OptionsValuesBox 
                                        key={currency.label+index}
                                        bg={currencyData.currency.label === currency.label}
                                        onClick={()=>currencyData.handleCurrency({label: currency.label, symbol: currency.symbol})}
                                        >
                                            <TitleRalewayH3>
                                                {currency.label}
                                            </TitleRalewayH3>

                                            <TitleRalewayH3>
                                            {currency.symbol}
                                            </TitleRalewayH3>
                                        </OptionsValuesBox>
                                        )
                                    })}
                                </CurrencyOptions>
                            </BoxRightCurrencyDiv>
                            )
                        }}
                    </CurrencyContext.Consumer>

                    <BoxRightCart empty={this.context.cart.length<=0}>
                        <Cart onClick={()=>this.setState({bag: !this.state.bag})}/>
                        <TitleRalewayH3 className="number">{this.context.totalItems}</TitleRalewayH3>

                        <CartBagPreview 
                            onMouseLeave={()=>this.setState({bag: false})} 
                            bag={this.state.bag}
                        >
                            <TitleRalewayH2>My Bag, {this.context.totalItems} {this.context.totalItems < 2 ? "item" : "items"}</TitleRalewayH2>
                            
                            <ComponentItemsCartList/>

                            <div>
                                <TitleRalewayH2>TOTAL:</TitleRalewayH2> 
                                {this.getFinalPrice()}
                            </div>

                            <BagButtonBox>
                                <Link to="cart"><ComponentButton>VIEW BAG</ComponentButton></Link>
                                
                                <Link to="#"><ComponentButton variant={true}>LOG OUT</ComponentButton></Link>
                            </BagButtonBox>
                        </CartBagPreview>

                    </BoxRightCart>
                </HeaderBoxRight>
            </HeaderContainer>
        )
    }
}

export default memo(ComponentHeader);