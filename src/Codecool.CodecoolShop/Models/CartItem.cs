﻿using Newtonsoft.Json;

namespace Codecool.CodecoolShop.Models
{
    public class CartItem
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("price")]
        public float Price { get; set; }

        [JsonProperty("quantity")]
        public int Quantity { get; set; }
    }
}