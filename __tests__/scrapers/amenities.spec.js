const scrapers = require('../../scrapers')

describe('amenities Scraper' , () => {

  let Scraper
  beforeEach(() => {
    Scraper = {
      amenities: {},
      $: cheerio.load(`<div class="html-content">
      <h2>Apartment Features:</h2>
  <ul>
    <li>New/Renovated Interior</li>
    <li>Spacious Floor Plans</li>
    <li>Granite or Quartz Counter Tops</li>
    <li>Black Appliances</li>
    <li>French-Door Refrigerator*</li>
    <li>Wood-Style Flooring</li>
    <li>Pre-Wired for Surround Sound</li>
    <li>Oversized Closets</li>
    <li>Washer &amp; Dryer in Unit</li>
    <li>9ft Ceilings</li>
    <li>Large Patio/Balconies</li>
    <li>Valet Door-to-Door Trash Service</li>
    <li>Cable/Satellite Available</li>
    <li>Garbage Disposal</li>
    <li>Electric Stove</li>
    <li>Recessed Sink</li>
    <li>Dishwasher</li>
    <li>Ceiling Fans*</li>
    <li>Central Air</li>
    <li>Linen Closets</li>
    <li>Attached &amp; Detached Garages</li>
  </ul>
  <p>*Select Homes</p>
  </div>`),
      addScraper: jest.fn(),
      addProp: jest.fn(),
      pageSlug: 'amenities',
      template: {
        amenities: {
          slug: 'amenities',
          selector: 'ul li'
        }
      }
      }
  })
  const cheerio = require('cheerio')
  const { init, getAmenities } = require('../../scrapers/amenities')
  test('AddScraper Called with function', () => {
    init(Scraper)
    expect(Scraper.addScraper).toHaveBeenCalledWith('afterPageChange', getAmenities)
  })

  test('Scrape Amenities With Template', () => {
    getAmenities(Scraper)
    expect(Scraper.amenities).toEqual([
      'New/Renovated Interior',
      'Spacious Floor Plans',
      'Granite or Quartz Counter Tops',
      'Black Appliances',
      'French-Door Refrigerator*',
      'Wood-Style Flooring',
      'Pre-Wired for Surround Sound',
      'Oversized Closets',
      'Washer & Dryer in Unit',
      '9ft Ceilings',
      'Large Patio/Balconies',
      'Valet Door-to-Door Trash Service',
      'Cable/Satellite Available',
      'Garbage Disposal',
      'Electric Stove',
      'Recessed Sink',
      'Dishwasher',
      'Ceiling Fans*',
      'Central Air',
      'Linen Closets',
      'Attached & Detached Garages'
    ])
  })

  test('Scrape Amenities Without Template', () => {
    Scraper.template = null
    getAmenities(Scraper)
    expect(Scraper.amenities).toEqual({})
  })
})
