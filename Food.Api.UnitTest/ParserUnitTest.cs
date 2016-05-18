using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;

namespace Food.Api.UnitTest
{
    public abstract class ParserUnitTest
    {
        protected IMenuParser parser;

        [TestMethod]
        public void TestCountKeysInfo()
        {
            Assert.IsTrue(parser.GetInfo().Keys.Count > 2);
        }

        [TestMethod]
        public void TestNameKeysInfo()
        {
            string[] required_keys = { "id", "name", "icon" }; 
            CollectionAssert.IsSubsetOf(required_keys, parser.GetInfo().Keys);
        }

    }

    [TestClass]
    public class ChudoPechkaHtmlParserTest : ParserUnitTest
    {
        [TestInitialize]
        public void Setup()
        {
            this.parser = new ChudoPechkaHtmlParser();
        }
    }

    [TestClass]
    public class ChudoPechkaWordParserTest : ParserUnitTest
    {
        [TestInitialize]
        public void Setup()
        {
            this.parser = new ChudoPechkaWordParser();
        }
    }

    [TestClass]
    public class McDonaldsParserTest : ParserUnitTest
    {
        [TestInitialize]
        public void Setup()
        {
            this.parser = new McDonaldsParser();
        }
    }

}
