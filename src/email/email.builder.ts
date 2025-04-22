interface HTMLStringBuilderInterface {
  addParagraph(text: string): this;
  addHeading(text: string, level: number): this;
  addLink(text: string, href: string): this;
  build(): string;
}

export class HTMLEmailBuilder implements HTMLStringBuilderInterface {
  private htmlParts: string[] = [];

  public addParagraph(text: string): this {
    this.htmlParts.push(`<p>${text}</p>`);
    return this;
  }

  public addHeading(text: string, level: number): this {
    this.htmlParts.push(`<h${level}>${text}</h${level}>`);
    return this;
  }

  public addLink(text: string, href: string): this {
    this.htmlParts.push(`<a href="${href}">${text}</a>`);
    return this;
  }

  public build(): string {
    return this.htmlParts.join('\n');
  }
}
