import { Module } from "@nestjs/common";
import { MatchController } from "src/controllers/match.controller";
import { MatchService } from "src/services/match.service";

@Module(
	{
		providers: [ MatchService ],
		controllers: [ MatchController ],
	}
)
export class MatchModule {

}